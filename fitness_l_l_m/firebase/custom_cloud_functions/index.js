const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();

exports.stravaAuthInitiate = functions
    .region("us-west1")
    .https.onCall(async (data, context) => {
        console.log("Function called with data:", data);

        // Security checks
        if (!context.auth) {
            console.error("Authentication missing");
            throw new functions.https.HttpsError(
                "unauthenticated",
                "Authentication required",
            );
        }

        const userId = context.auth.uid;
        console.log("Processing for user:", userId);
        const { authorizationCode } = data;
        console.log("Received authorization code:", authorizationCode);

        try {
            console.log("Attempting Strava token exchange");
            // Exchange code with Strava
            const clientId = functions.config().strava.client_id;
            const clientSecret = functions.config().strava.client_secret;
            const response = await axios.post(
                "https://www.strava.com/oauth/token",
                {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: authorizationCode,
                    grant_type: "authorization_code",
                },
            );

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
            return { success: true };
        } catch (error) {
            console.error("Strava token exchange error:", error);
            console.error("Error details:", error.response?.data || error.message);
            throw new functions.https.HttpsError(
                "internal",
                "Failed to complete Strava connection",
                error.response?.data || error.message,
            );
        }
    });
