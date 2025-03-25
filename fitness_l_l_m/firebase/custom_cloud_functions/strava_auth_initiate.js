const functions = require("firebase-functions").region("us-west1");
const admin = require("firebase-admin");
const axios = require("axios");

// Initialize Firebase once
if (!admin.apps.length) admin.initializeApp();

exports.stravaAuthInitiate = functions.https.onCall(async (data, context) => {
  // Security checks
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required",
    );
  }

  const userId = context.auth.uid;
  const { authorizationCode } = data;

  try {
    // Exchange code with Strava
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: functions.config().strava.client_id,
      client_secret: functions.config().strava.client_secret,
      code: authorizationCode,
      grant_type: "authorization_code",
    });

    // Direct Firestore update
    await admin.firestore().collection("users").doc(userId).update({
      stravaAccessToken: response.data.access_token,
      stravaRefreshToken: response.data.refresh_token,
      stravaExpiresAt: response.data.expires_at,
      stravaAthleteId: response.data.athlete.id,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Strava token exchange error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to complete Strava connection",
      error.response?.data || error.message,
    );
  }
});
