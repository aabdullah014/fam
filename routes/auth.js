const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const passport = require('passport');



router.get('/register', (req, res) => {
    res.render('./auth/register');
})

router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err)
            }
        })
        req.flash('success', `Welcome to find-a-masjid, ${username}!`);
        res.redirect('/masajid');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}));


router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back, ${username}!`);
    const lastUrl = req.session.returnTo || '/masajid';
    delete req.session.returnTo;
    res.redirect(lastUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out, hope to see you soon!');
    res.redirect('/masajid')
})




module.exports = router;