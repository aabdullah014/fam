const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
mongoose.connect('mongodb://localhost:27017/masjid-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const methodOverride = require('method-override');
const Masjid = require('./models/masjid');
const path = require('path');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
});

const app = express();

//set view engine to verify we will use ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//help parse req.body created from post request from new.ejs form
app.use(express.urlencoded({ extended: true }));

//to incorporate PUT request
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

//GET route to index of all masajid
app.get('/masajid', async (req, res) => {
    const masajid = await Masjid.find({});
    res.render('masajid/index', { masajid })
})

//GET route to create a new masjid
app.get('/masajid/new', (req, res) => {
    res.render('masajid/new');
})

//POST route to submit request
app.post('/masajid', async (req, res) => {
    const masjid = new Masjid(req.body.masjid);
    await masjid.save();
    res.redirect(`/masajid/${masjid._id}`);
})

//GET route to show page of a masjid
app.get('/masajid/:id', async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    res.render('masajid/show', { masjid });
})

//GET route to edit a masjid
app.get('/masajid/:id/edit', async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    res.render('masajid/edit', { masjid });
})

//PUT request to update masjid
app.put('/masajid/:id', async (req, res) => {
    const { id } = req.params;
    const masjid = await Masjid.findByIdAndUpdate(id, { ...req.body.masjid });
    res.redirect(`/masajid/${masjid.id}`);
})

//DELETE request to delete masjid
app.delete('/masajid/:id', async (req, res) => {
    const { id } = req.params;
    await Masjid.findByIdAndDelete(id);
    res.redirect('/masajid');
})


//verify that server is on and listening
app.listen(3000, () => {
    console.log('Listening on port 3000')
})