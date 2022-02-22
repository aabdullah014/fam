const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL

mongoose.connect('mongodb+srv://aabdullah014:F17VtpjEaSS5YWyA@cluster0.ysjjn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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