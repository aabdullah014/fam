const mongoose = require('mongoose');
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
    phone: String
})



module.exports = mongoose.model('Masjid', masjidSchema);