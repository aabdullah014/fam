const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/ExpressError');
const Masjid = require('../models/masjid');
const { masjidSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

//joi validation on server side
const validateMasjid = (req, res, next) => {
    const { error } = masjidSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

//ensures user is logged in before doing protected actions


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
    // if (!req.body.masjid) throw new ExpressError('Invalid Masjid Data', 400)
    const masjid = new Masjid(req.body.masjid);
    await masjid.save();
    req.flash('success', 'Succesfully made a new masjid!');
    res.redirect(`/masajid/${masjid._id}`);
}))

//GET route to show page of a masjid
router.get('/:id', wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id).populate('reviews');
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    res.render('masajid/show', { masjid });
}))

//GET route to edit a masjid
router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    res.render('masajid/edit', { masjid });
}))

//PUT request to update masjid
router.put('/:id', isLoggedIn, validateMasjid, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const masjid = await Masjid.findByIdAndUpdate(id, { ...req.body.masjid });
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    req.flash('success', 'Successfully updated Masjid!')
    res.redirect(`/masajid/${masjid._id}`);
}))

//DELETE request to delete masjid
router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Masjid.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Masjid.');
    res.redirect('/masajid/');
}))


module.exports = router;