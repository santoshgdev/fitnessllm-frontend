// Add to passport-setup.js
const StravaStrategy = require('passport-strava-oauth2').Strategy;

passport.use(new StravaStrategy({
        clientID: process.env.STRAVA_CLIENT_ID,
        clientSecret: process.env.STRAVA_CLIENT_SECRET,
        callbackURL: '/auth/strava/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // Implement athlete profile handling
    }
));
