router.get('/', (req, res) => {
    res.render('profile', { user: req.user });
});
