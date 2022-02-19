const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Masjid = require('../models/masjid');
const { isLoggedIn, isAuthorized, validateMasjid } = require('../middleware');

//GET route to index of all masajid
router.get('/', wrapAsync(async (req, res) => {
    const masajid = await Masjid.find({});
    res.render('masajid/index', { masajid })
}))

//GET route to create a new masjid
router.get('/new', isLoggedIn, (req, res) => {
    res.render('masajid/new');
})

//POST route to submit request
router.post('/', isLoggedIn, validateMasjid, wrapAsync(async (req, res, next) => {
    const masjid = new Masjid(req.body.masjid);
    masjid.author.push('620f14916417a70d6a1911f4');
    masjid.author.push(req.user._id);
    await masjid.save();
    req.flash('success', 'Succesfully made a new masjid!');
    res.redirect(`/masajid/${masjid._id}`);
}))

//GET route to show page of a masjid
router.get('/:id', wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    const currentUser = req.user;
    const isOwner = (currentUser && currentUser.id == masjid.author[0].id);
    const isAuthor = (currentUser && currentUser.id == masjid.author[masjid.author.length - 1].id);
    res.render('masajid/show', { masjid, currentUser, isOwner, isAuthor });
}))

//GET route to edit a masjid
router.get('/:id/edit', isLoggedIn, isAuthorized, wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    res.render('masajid/edit', { masjid });
}))

//PUT request to update masjid
router.put('/:id', isLoggedIn, isAuthorized, validateMasjid, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const masjid = await Masjid.findById(id);
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    const mas = await Masjid.findByIdAndUpdate(id, { ...req.body.masjid });
    req.flash('success', 'Successfully updated Masjid!')
    res.redirect(`/masajid/${mas._id}`);
}))

//DELETE request to delete masjid
router.delete('/:id', isLoggedIn, isAuthorized, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Masjid.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Masjid.');
    res.redirect('/masajid/');
}))


module.exports = router;