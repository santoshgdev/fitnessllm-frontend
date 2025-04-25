const admin = require("firebase-admin/app");
admin.initializeApp();

const stravaAuthInitiate = require("./strava_auth_initiate.js");
exports.stravaAuthInitiate = stravaAuthInitiate.stravaAuthInitiate;
