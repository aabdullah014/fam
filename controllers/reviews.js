const Review = require('../models/review');
const Masjid = require('../models/masjid');


module.exports.createReview = async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    masjid.reviews.push(review);
    await review.save();
    await masjid.save();

    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/masajid/${masjid._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Masjid.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review.');
    res.redirect(`/masajid/${id}`)
}