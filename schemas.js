const joi = require('joi');

module.exports.masjidSchema = joi.object({
    masjid: joi.object({
        name: joi.string().required(),
        city: joi.string().required(),
        street: joi.string(),
        image: joi.string(),
        state: joi.string().required().min(2).max(2),
        zipcode: joi.number().required().min(10000).max(99999)
    }).required()
});



module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
})