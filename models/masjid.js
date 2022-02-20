const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200/h_200');
})
//create Schema for Masjid.
const masjidSchema = new Schema({
    author: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    name: String,
    image: [imageSchema],
    street: String,
    zipcode: Number,
    country: String,
    state: String,
    city: String,
    locality: String,
    phone: String,
    description: String,
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