const expressError = require('./utils/ExpressError');
const { masjidSchema, reviewSchema } = require('./schemas.js');
const Masjid = require('./models/masjid');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to do that.')
        return res.redirect('/login');
    }
    next();
}

module.exports.addMasjidImage = (req, res, next) => {
    const { id } = req.params;
    const masjid = Masjid.findById(id)
    if (!masjid.image) {
        masjid.image = "https://res.cloudinary.com/djamcsili/image/upload/v1645310649/fam/photo-1494616150024-f6040d5220c0_qeig0p.jpg"
    }
    next();
}

//joi validation on server side
module.exports.validateMasjid = (req, res, next) => {
    const { error } = masjidSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

//JOI server-side validation for reviews
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

//permission to change masajid
module.exports.isAuthorized = async (req, res, next) => {
    const { id } = req.params;
    const masjid = await Masjid.findById(id);
    if (!masjid.author.includes(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect(`/masajid/${id}`);
    }
    next();
}

//permission to change reviews
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect(`/masajid/${id}`);
    }
    next();
}