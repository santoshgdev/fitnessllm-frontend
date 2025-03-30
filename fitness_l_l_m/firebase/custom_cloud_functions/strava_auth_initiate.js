const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const axios = require("axios");
const crypto = require("crypto");
// To avoid deployment errors, do not call admin.initializeApp() in your code

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Define both secrets
const stravaApi = defineSecret("strava_api");
const encryptToken = defineSecret("encrypt_token");

/**
 * Encrypts a string using AES-256-CBC and returns a base64 string containing all necessary components
 * Format: base64(iv):base64(encrypted_data)
 *
 * To decrypt in Python:
 * ```python
 * from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
 * from cryptography.hazmat.primitives import padding
 * from cryptography.hazmat.backends import default_backend
 * from base64 import b64decode
 *
 * def decrypt_token(encrypted_str, key):
 *     # Split the components
 *     iv, encrypted_data = map(b64decode, encrypted_str.split(':'))
 *
 *     # Create cipher
 *     cipher = Cipher(
 *         algorithms.AES(key.encode()),  # Convert string key to bytes
 *         modes.CBC(iv),
 *         backend=default_backend()
 *     )
 *     decryptor = cipher.decryptor()
 *
 *     # Decrypt
 *     padded = decryptor.update(encrypted_data) + decryptor.finalize()
 *
 *     # Remove padding
 *     unpadder = padding.PKCS7(128).unpadder()
 *     return unpadder.update(padded) + unpadder.finalize().decode('utf-8')
 * ```
 */
function encryptToken(token, key) {
  // Generate a random IV
  const iv = crypto.randomBytes(16);

  // Create cipher (use the key directly as a string)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Encrypt
  let encrypted = cipher.update(token, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Combine IV and encrypted data with a delimiter
  return `${iv.toString("base64")}:${encrypted}`;
}

// Export the function without initializing admin
exports.stravaAuthInitiate = onCall(
  {
    timeoutSeconds: 30,
    memory: "128MB",
    region: "us-west1",
    secrets: [stravaApi, encryptToken],
  },
  async (request) => {
    const { data, auth } = request;
    console.log("Function called with data:", JSON.stringify(data, null, 2));

    // Security checks
    if (!auth) {
      console.error("Authentication missing");
      throw new HttpsError("unauthenticated", "Authentication required");
    }

    const userId = auth.uid;
    console.log("Processing for user:", userId);
    const { authorizationCode } = data;

    if (!authorizationCode) {
      throw new HttpsError(
        "invalid-argument",
        "Authorization code is required",
      );
    }

    try {
      console.log("Attempting Strava token exchange");
      // Get Strava credentials from stravaApi
      const stravaConfig = JSON.parse(stravaApi.value());
      // Get encryption key from dedicated secret
      const encryptConfig = JSON.parse(encryptToken.value());
      
      if (!encryptConfig.token) {
        throw new HttpsError("internal", "Encryption key not configured");
      }

      if (!stravaConfig.client_id || !stravaConfig.client_secret) {
        throw new HttpsError("invalid-argument", "Invalid Strava credentials");
      }

      const requestBody = {
        client_id: parseInt(stravaConfig.client_id, 10),
        client_secret: stravaConfig.client_secret,
        code: authorizationCode,
        grant_type: stravaConfig.grant_type,
      };

      const response = await axios.post(
        "https://www.strava.com/oauth/token",
        requestBody,
      );

      // Use encryption key from the dedicated encrypt_token secret
      const accessTokenEnc = encryptToken(
        response.data.access_token,
        encryptConfig.token
      );
      const refreshTokenEnc = encryptToken(
        response.data.refresh_token,
        encryptConfig.token
      );

      // Get current timestamp
      const now = admin.firestore.Timestamp.now();

      // Safely get values with defaults
      const scope = response.data.scope || 'read,activity:read';  // Default minimal scope
      const athleteData = response.data.athlete || {};
      const athleteId = athleteData.id;

      if (!athleteId) {
        throw new HttpsError('internal', 'Invalid response from Strava: missing athlete ID');
      }

      // Create the data structure
      const updateData = {
        "stream=strava": {
          // Encrypted tokens with format: base64(iv):base64(encrypted_data)
          accessToken: accessTokenEnc,
          refreshToken: refreshTokenEnc,
          // Authentication metadata
          expiresAt: response.data.expires_at || (Math.floor(Date.now() / 1000) + 21600), // Default 6 hours
          tokenType: response.data.token_type || 'Bearer',
          scope: scope,
          // User metadata
          athlete: {
            id: athleteId,
            firstname: athleteData.firstname || '',
            lastname: athleteData.lastname || '',
            profile: athleteData.profile || '',
            // Only store essential athlete data
          },
          // Connection metadata
          lastUpdated: now,
          lastTokenRefresh: now,
          connectionStatus: "active",
          version: "1.0", // For future schema migrations
        },
      };

      console.log("Updating Firestore with data:", JSON.stringify(updateData, null, 2));

      // Update Firestore with merge to preserve any existing data
      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .update(updateData);

      console.log("User data updated successfully");
      return {
        success: true,
        athleteId: response.data.athlete.id,
        scope: response.data.scope,
      };
    } catch (error) {
      console.error("Strava token exchange error:", error);

      // Enhanced error handling
      if (error.response) {
        const statusCode = error.response.status;
        const errorData = error.response.data;

        console.error("Full error response:", {
          status: statusCode,
          data: errorData,
          headers: error.response.headers,
          requestData: error.config?.data
        });

        // Handle specific Strava error cases
        if (statusCode === 400) {
          const errorMessage = errorData.message || 'Bad Request';
          const errors = errorData.errors || [];

          // Log detailed error information
          console.error("Strava API error details:", {
            message: errorMessage,
            errors: errors
          });

          // Common Strava error cases
          if (errors.some(e => e.field === "code" || e.code === "invalid")) {
            throw new HttpsError(
              "invalid-argument",
              "Invalid or expired authorization code. Please try authenticating again.",
              { stravaError: errorData }
            );
          }

          if (errors.some(e => e.field === "client_id" || e.field === "client_secret")) {
            throw new HttpsError(
              "internal",
              "Invalid API credentials. Please contact support.",
              { stravaError: errorData }
            );
          }

          // Generic 400 error
          throw new HttpsError(
            "invalid-argument",
            `Strava API error: ${errorMessage}`,
            { stravaError: errorData }
          );
        }

        if (statusCode === 401) {
          throw new HttpsError(
            "unauthenticated",
            "Authentication failed with Strava. Please try again.",
            { stravaError: errorData }
          );
        }

        if (statusCode === 429) {
          throw new HttpsError(
            "resource-exhausted",
            "Too many requests to Strava API. Please try again later.",
            { stravaError: errorData }
          );
        }

        // Generic error with response
        throw new HttpsError(
          "unknown",
          `Strava API error (${statusCode}): ${errorData.message || 'Unknown error'}`,
          { stravaError: errorData }
        );
      }

      // Network or other errors
      throw new HttpsError(
        "internal",
        "Failed to connect to Strava. Please try again later.",
        { error: error.message }
      );
    }
  },
);
