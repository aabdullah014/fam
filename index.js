if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const expressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const masajidRoutes = require('./routes/masajid');
const reviewsRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/masjid-finder';
const secret = process.env.SECRET || 'secretysec'

mongoose.connect(dbUrl, {
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

//store session in mongo instead of memory
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
})

store.on("error", function (e) {
    console.log("Session Store Error:", e)
})

//implementation of sessions
const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(cookieParser());

//passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//help parse req.body created from post request from new.ejs form
app.use(express.urlencoded({ extended: true }));

//to incorporate PUT request
app.use(methodOverride('_method'));

//serve public assets
app.use(express.static(path.join(__dirname, 'public')));

//prevent keys that contain $ or a period
app.use(mongoSanitize())

//flash implementation where success is stored in res.locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', authRoutes);
app.use('/masajid', masajidRoutes);
app.use('/masajid/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

//error handling
app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    res.status(statusCode).render('error', { err })
})

const port = proces.env.PORT || 3000
//verify that server is on and listening
app.listen(port, () => {
    console.log('Listening on port 3000')
})

