router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
