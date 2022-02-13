const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

//create Schema for Masjid.
const masjidSchema = new Schema({
    name: String,
    image: String,
    street: String,
    zipcode: Number,
    country: String,
    state: String,
    city: String,
    locality: String,
    phone: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, ref: 'Review'
        }
    ]
})


masjidSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Masjid', masjidSchema);