const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../models/review');
const Masjid = require('../models/masjid');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


//POST request to add review
router.post('/', validateReview, isLoggedIn, wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    masjid.reviews.push(review);
    await review.save();
    await masjid.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/masajid/${masjid._id}`);
}))

//DELETE request to delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Masjid.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review.');
    res.redirect(`/masajid/${id}`)

}))

module.exports = router;