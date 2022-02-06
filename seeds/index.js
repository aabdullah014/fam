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
            location: "Gainesville, Florida",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        },
        {
            name: "Hoda Center",
            location: "Gainesville, Florida",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        },
        {
            name: "Masjid Bilal",
            location: "Canton, Michigan",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        },
        {
            name: "Canton Islamic Center",
            location: "Canton, Michigan",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        },
        {
            name: "Muslim Community of Western Suburbs",
            location: "Canton, Michigan",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        },
        {
            name: "Muslim Community Mosque Phoenix",
            location: "Phoenix, Arizona",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        },
        {
            name: "Masjid Al-Rahma",
            location: "Phoenix, Arizona",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        },
        {
            name: "Islamic Center of North Phoenix",
            location: "Phoenix, Arizona",
            image: "https://images.unsplash.com/photo-1503332629621-854af002364b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=746&q=80"
        }
    ])
}

seedDB().then(() => {
    mongoose.connection.close();
})