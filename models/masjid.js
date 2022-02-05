const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema for Masjid.
const masjidSchema = new Schema({
    name: String,
    location: String,
    description: String
})



module.exports = mongoose.model('Masjid', masjidSchema);