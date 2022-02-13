const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema for Masjid.
const reviewSchema = new Schema({
    rating: Number,
    body: String
})


module.exports = mongoose.model('Review', reviewSchema);

