const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas.js');
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Masjid = require('../models/masjid');

//JOI server-side validation for reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}


//POST request to add review
router.post('/', validateReview, wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    const review = new Review(req.body.review);
    masjid.reviews.push(review);
    await review.save();
    await masjid.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/masajid/${masjid._id}`);
}))

//DELETE request to delete review
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Masjid.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review.');
    res.redirect(`/masajid/${id}`)

}))

module.exports = router;