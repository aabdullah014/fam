const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean != value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
})

const joi = baseJoi.extend(extension)

module.exports.masjidSchema = joi.object({
    masjid: joi.object({
        name: joi.string().required().escapeHTML(),
        city: joi.string().required(),
        street: joi.string().escapeHTML(),
        state: joi.string().required().min(2).max(2),
        zipcode: joi.number().required().min(10000).max(99999),
        description: joi.string().allow(null).allow('').escapeHTML(),
        phone: joi.string().min(10).max(10).allow(null).allow(''),
        rating: joi.number()
    }).required(),
    deleteImages: joi.array()
});



module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
})