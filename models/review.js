const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema for Masjid.
const reviewSchema = new Schema({
    rating: Number,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports = mongoose.model('Review', reviewSchema);

