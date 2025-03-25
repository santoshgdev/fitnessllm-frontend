const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

exports.stravaAuthInitiate = require("./strava_auth_initiate").stravaAuthInitiate;
