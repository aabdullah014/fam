const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const auth = require('../controllers/auth');


router.route('/register')
    //GET request to render register form
    .get(auth.renderRegister)
    //POST request to create new user
    .post(wrapAsync(auth.createUser))

router.route('/login')
    //GET request to render login form
    .get(auth.renderLogin)
    //POST request to login user
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), auth.login)

//GET request to logout user
router.get('/logout', auth.logout)




module.exports = router;