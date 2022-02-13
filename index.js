const express = require('express');
const mongoose = require('mongoose');
const expressError = require('./utils/ExpressError');
const { masjidSchema, reviewSchema } = require('./schemas.js')
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync')
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/masjid-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const methodOverride = require('method-override');
const Masjid = require('./models/masjid');
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

//help parse req.body created from post request from new.ejs form
app.use(express.urlencoded({ extended: true }));

//to incorporate PUT request
app.use(methodOverride('_method'));

//joi validation on server side
const validateMasjid = (req, res, next) => {
    const { error } = masjidSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}



app.get('/', (req, res) => {
    res.render('home');
})

//GET route to index of all masajid
app.get('/masajid', wrapAsync(async (req, res) => {
    const masajid = await Masjid.find({});
    res.render('masajid/index', { masajid })
}))

//GET route to create a new masjid
app.get('/masajid/new', (req, res) => {
    res.render('masajid/new');
})

//POST route to submit request
app.post('/masajid', validateMasjid, wrapAsync(async (req, res, next) => {
    // if (!req.body.masjid) throw new ExpressError('Invalid Masjid Data', 400)

    const masjid = new Masjid(req.body.masjid);
    await masjid.save();
    res.redirect(`/masajid/${masjid._id}`);
}))

//GET route to show page of a masjid
app.get('/masajid/:id', wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id).populate('reviews');
    res.render('masajid/show', { masjid });
}))

//GET route to edit a masjid
app.get('/masajid/:id/edit', wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    res.render('masajid/edit', { masjid });
}))

//PUT request to update masjid
app.put('/masajid/:id', validateMasjid, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const masjid = await Masjid.findByIdAndUpdate(id, { ...req.body.masjid });
    res.redirect(`/masajid/${masjid.id}`);
}))

//DELETE request to delete masjid
app.delete('/masajid/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Masjid.findByIdAndDelete(id);
    res.redirect('/masajid');
}))

//POST request to add review
app.post('/masajid/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    Review.deleteMany({})
    const masjid = await Masjid.findById(req.params.id);
    const review = Review(req.body.review);
    masjid.reviews.push(review);
    await review.save();
    await masjid.save();

    res.redirect(`/masajid/${masjid._id}`);
}))

//DELETE request to delete review
app.delete('/masajid/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Masjid.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/masajid/${id}`)

}))

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

