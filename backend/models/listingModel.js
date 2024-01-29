const { Schema, model } = require('mongoose');

const listingSchema = new Schema(
    {
        title: {type: String, required: true},
        description: {type: String},
        price: {type: Number},
        posterEmail:{type: String},
        quantity: {type: Number},
        image: {type: String}
    },
    {
        timestamps: true
    }
);

const Listing = model('Listings', listingSchema);

module.exports = Listing;