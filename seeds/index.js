const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/masjid-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const masajid = require('./masjidSeeds');
const Masjid = require('../models/masjid');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
});


const seedDB = async () => {
    await Masjid.deleteMany({});
    await Masjid.insertMany(masajid.masajid)
}

seedDB().then(() => {
    mongoose.connection.close();
})