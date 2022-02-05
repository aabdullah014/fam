const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/masjid-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const masjid = require('./models/masjid')
const path = require('path');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home');
})
app.get('/makeMasjid', async (req, res) => {
    const m = new masjid({
        name: 'Hoda',
        location: 'Gainesville'
    })
    await m.save();
    res.send(m);
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})