const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const axios = require('axios');
const crypto = require('crypto');
// To avoid deployment errors, do not call admin.initializeApp() in your code

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Define secret
const stravaApi = defineSecret('strava_api');

// Simple encryption helper (you might want to use a more robust solution)
function encryptToken(token) {
  // In production, use a proper encryption key management system
  const key = process.env.ENCRYPTION_KEY || 'your-encryption-key';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    encrypted: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

// Export the function without initializing admin
exports.stravaAuthInitiate = onCall(
  {
    timeoutSeconds: 30,
    memory: '128MB',
    region: 'us-west1',
    secrets: [stravaApi]
  },
  async (request) => {
    const { data, auth } = request;
    console.log("Function called with data:", JSON.stringify(data, null, 2));

    // Security checks
    if (!auth) {
      console.error("Authentication missing");
      throw new HttpsError('unauthenticated', "Authentication required");
    }

    const userId = auth.uid;
    console.log("Processing for user:", userId);
    const { authorizationCode } = data;

    if (!authorizationCode) {
      throw new HttpsError('invalid-argument', 'Authorization code is required');
    }

    try {
      console.log("Attempting Strava token exchange");
      // Exchange code with Strava
      const stravaConfig = JSON.parse(stravaApi.value());

      const requestBody = {
        client_id: parseInt(stravaConfig.client_id, 10),
        client_secret: stravaConfig.client_secret,
        code: authorizationCode,
        grant_type: stravaConfig.grant_type,
      };

      const response = await axios.post(
        "https://www.strava.com/oauth/token",
        requestBody
      );

      // Encrypt sensitive data
      const accessTokenEnc = encryptToken(response.data.access_token);
      const refreshTokenEnc = encryptToken(response.data.refresh_token);

      // Get current timestamp
      const now = admin.firestore.Timestamp.now();

      // Create the data structure
      const updateData = {
        'stream=strava': {
          // Encrypted tokens
          accessToken: accessTokenEnc,
          refreshToken: refreshTokenEnc,
          // Authentication metadata
          expiresAt: response.data.expires_at,
          tokenType: response.data.token_type,
          scope: response.data.scope,
          // User metadata
          athleteId: response.data.athlete.id,
          athlete: {
            id: response.data.athlete.id,
            firstname: response.data.athlete.firstname,
            lastname: response.data.athlete.lastname,
            profile: response.data.athlete.profile,
            // Only store essential athlete data
          },
          // Connection metadata
          lastUpdated: now,
          lastTokenRefresh: now,
          connectionStatus: 'active',
          version: '1.0', // For future schema migrations
        },
        'integrations.strava': {
          connected: true,
          athleteId: response.data.athlete.id,
          lastUpdated: now,
          connectionStatus: 'active',
          scope: response.data.scope,
        }
      };

      // Update Firestore with merge to preserve any existing data
      await admin.firestore()
        .collection("users")
        .doc(userId)
        .update(updateData);

      console.log("User data updated successfully");
      return {
        success: true,
        athleteId: response.data.athlete.id,
        scope: response.data.scope
      };
    } catch (error) {
      console.error("Strava token exchange error:", error);

      // Enhanced error handling
      if (error.response) {
        const statusCode = error.response.status;
        const errorData = error.response.data;

        // Handle specific error cases
        if (statusCode === 400 && errorData.errors?.[0]?.code === 'invalid') {
          throw new HttpsError(
            'invalid-argument',
            'Invalid authorization code. Please try authenticating again.',
            errorData
          );
        }

        console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
        console.error("Error response status:", statusCode);
      }

      throw new HttpsError(
        'internal',
        'Failed to complete Strava connection. Please try again later.',
        error.message
      );
    }
  }
);
