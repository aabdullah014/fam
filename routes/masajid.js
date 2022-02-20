const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const masajid = require('../controllers/masajid');
const { isLoggedIn, isAuthorized, validateMasjid } = require('../middleware');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });


router.route('/')
    //GET route to index of all masajid
    .get(wrapAsync(masajid.index))
    //POST route to submit request to create masjid
    .post(isLoggedIn, upload.array('masjid[image]'), validateMasjid, wrapAsync(masajid.createMasjid))

//GET route to create a new masjid
router.get('/new', isLoggedIn, masajid.renderNewMasjid)

router.route('/:id')
    //GET route to show page of a masjid
    .get(wrapAsync(masajid.showMasjid))
    //PUT request to update masjid
    .put(isLoggedIn, isAuthorized, upload.array('masjid[image]'), validateMasjid, wrapAsync(masajid.updateMasjid))
    //DELETE request to delete masjid
    .delete(isLoggedIn, isAuthorized, wrapAsync(masajid.deleteMasjid))

//GET route to edit a masjid
router.get('/:id/edit', isLoggedIn, isAuthorized, wrapAsync(masajid.renderEditMasjid))


module.exports = router;