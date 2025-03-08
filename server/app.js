const express = require('express');
const passport = require('passport');
const app = express();

// Basic configuration
app.use(passport.initialize());
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
