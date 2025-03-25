const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const axios = require('axios');
// To avoid deployment errors, do not call admin.initializeApp() in your code

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Define secret
const stravaApi = defineSecret('strava_api');

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
    console.log("Received authorization code:", authorizationCode);

    try {
      console.log("Attempting Strava token exchange");
      // Exchange code with Strava
      const stravaConfig = JSON.parse(stravaApi.value());
      console.log("Strava config (redacted):", {
        ...stravaConfig,
        client_secret: '[REDACTED]'
      });

      const requestBody = {
        client_id: parseInt(stravaConfig.client_id, 10),
        client_secret: stravaConfig.client_secret,
        code: authorizationCode,
        grant_type: stravaConfig.grant_type,
      };
      console.log("Token exchange request body (redacted):", {
        ...requestBody,
        client_secret: '[REDACTED]'
      });

      const response = await axios.post(
        "https://www.strava.com/oauth/token",
        requestBody
      );

      console.log("Strava response received:", response.data);

      // Create the nested structure
      const stravaData = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: response.data.expires_at,
        athleteId: response.data.athlete.id,
        athlete: response.data.athlete, // Store full athlete info
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Update Firestore with nested structure
      const userRef = admin.firestore().collection("users").doc(userId);
      const streamRef = userRef.collection("stream").doc("strava");

      // Create a batch to ensure atomic updates
      const batch = admin.firestore().batch();

      // Update the stream/strava document
      batch.set(streamRef, stravaData, { merge: true });

      // Update the main user document with a reference
      batch.update(userRef, {
        'integrations.strava': {
          connected: true,
          athleteId: response.data.athlete.id,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }
      });

      // Commit the batch
      await batch.commit();

      console.log("User data updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Strava token exchange error:", error);
      if (error.response) {
        console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }

      // Format the error message properly
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
      throw new HttpsError(
        'internal',
        'Failed to complete Strava connection',
        errorMessage
      );
    }
  }
);
