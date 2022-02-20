const Masjid = require('../models/masjid');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    const masajid = await Masjid.find({});
    res.render('masajid/index', { masajid });
};

module.exports.renderNewMasjid = (req, res) => {
    res.render('masajid/new');
}

module.exports.createMasjid = async (req, res) => {
    const masjid = new Masjid(req.body.masjid);
    const address = req.body.masjid.street.concat(', ', req.body.masjid.city).concat(', ', req.body.masjid.state).concat(' ', req.body.masjid.zipcode);
    const geoData = await geocoder.forwardGeocode({
        query: address,
        limit: 1
    }).send()
    masjid.geometry = geoData.body.features[0].geometry;
    masjid.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    masjid.author.push('620f14916417a70d6a1911f4');
    masjid.author.push(req.user._id);
    if (masjid.phone && masjid.phone.length == 10) {
        masjid.phone = masjid.phone.slice(0, 3) + "-" + masjid.phone.slice(3, 6) + "-" + masjid.phone.slice(6);
    }
    await masjid.save();
    req.flash('success', 'Succesfully made a new masjid!');
    res.redirect(`/masajid/${masjid._id}`);
}

module.exports.showMasjid = async (req, res) => {
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
}

module.exports.renderEditMasjid = async (req, res) => {
    const masjid = await Masjid.findById(req.params.id);
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    res.render('masajid/edit', { masjid });
}

module.exports.updateMasjid = async (req, res) => {
    const { id } = req.params;
    const masjid = await Masjid.findById(id);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    masjid.image.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await masjid.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    await masjid.save();
    if (!masjid) {
        req.flash('error', "Couldn't find that Masjid!");
        return res.redirect('/masajid');
    }
    const mas = await Masjid.findByIdAndUpdate(id, { ...req.body.masjid });
    req.flash('success', 'Successfully updated Masjid!')
    res.redirect(`/masajid/${mas._id}`);
}

module.exports.deleteMasjid = async (req, res) => {
    const { id } = req.params;
    await Masjid.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Masjid.');
    res.redirect('/masajid/');
}