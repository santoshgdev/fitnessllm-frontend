const functions = require("firebase-functions").region("us-west1");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require('cors')({ origin: true });

// Initialize Firebase once
if (!admin.apps.length) admin.initializeApp();

exports.stravaAuthInitiate = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log("Function called with data:", req.body);

    // Security checks
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.error("Authentication missing");
      return res.status(403).send('Unauthorized');
    }

    const idToken = req.headers.authorization.split('Bearer ')[1];
    let userId;
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(idToken);
      userId = decodedIdToken.uid;
      console.log("Processing for user:", userId);
    } catch (error) {
      console.error("Error verifying ID token:", error);
      return res.status(403).send('Unauthorized');
    }

    const { authorizationCode } = req.body;
    console.log("Received authorization code:", authorizationCode);

    try {
      console.log("Attempting Strava token exchange");
      // Exchange code with Strava
      const response = await axios.post("https://www.strava.com/oauth/token", {
        client_id: functions.config().strava.client_id,
        client_secret: functions.config().strava.client_secret,
        code: authorizationCode,
        grant_type: "authorization_code",
      });

      console.log("Strava response received:", response.data);

      // Direct Firestore update
      await admin.firestore().collection("users").doc(userId).update({
        stravaAccessToken: response.data.access_token,
        stravaRefreshToken: response.data.refresh_token,
        stravaExpiresAt: response.data.expires_at,
        stravaAthleteId: response.data.athlete.id,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("User data updated successfully");
      return res.status(200).send({ success: true });
    } catch (error) {
      console.error("Strava token exchange error:", error);
      console.error("Error details:", error.response?.data || error.message);
      return res.status(500).send({ error: "Failed to complete Strava connection" });
    }
  });
});
