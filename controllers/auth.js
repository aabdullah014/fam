const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('./auth/register');
}

module.exports.createUser = async (req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login')
}

module.exports.login = (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back, ${username}!`);
    const lastUrl = req.session.returnTo || '/masajid';
    delete req.session.returnTo;
    res.redirect(lastUrl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out, hope to see you soon!');
    res.redirect('/masajid')
}