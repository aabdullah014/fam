const express = require('express');
const mongoose = require('mongoose');
const expressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const masajid = require('./routes/masajid');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/masjid-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const methodOverride = require('method-override');
const path = require('path');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
});

const app = express();

//set view engine to verify we will use ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//implementation of sessions
const sessionConfig = {
    secret: 'secretysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig));
app.use(flash());

//help parse req.body created from post request from new.ejs form
app.use(express.urlencoded({ extended: true }));

//to incorporate PUT request
app.use(methodOverride('_method'));

//serve public assets
app.use(express.static(path.join(__dirname, 'public')));


//flash implementation where success is stored in res.locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/masajid', masajid);
app.use('/masajid/:id/reviews', reviews);


//error handling
app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', { err })
})

//verify that server is on and listening
app.listen(3000, () => {
    console.log('Listening on port 3000')
})

