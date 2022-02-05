const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/masjid-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Masjid = require('../models/masjid')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
});

const seedDB = async () => {
    await Masjid.deleteMany({});
    await Masjid.insertMany([
        {
            name: "Islamic Community Center of Gainesville",
            location: "Gainesville, Florida"
        },
        {
            name: "Hoda Center",
            location: "Gainesville, Florida"
        },
        {
            name: "Masjid Bilal",
            location: "Canton, Michigan"
        },
        {
            name: "Canton Islamic Center",
            location: "Canton, Michigan"
        },
        {
            name: "Muslim Community of Western Suburbs",
            location: "Canton, Michigan"
        },
        {
            name: "Muslim Community Mosque Phoenix",
            location: "Phoenix, Arizona"
        },
        {
            name: "Masjid Al-Rahma",
            location: "Phoenix, Arizona"
        },
        {
            name: "Islamic Center of North Phoenix",
            location: "Phoenix, Arizona"
        }
    ])
}

seedDB().then(() => {
    mongoose.connection.close();
})