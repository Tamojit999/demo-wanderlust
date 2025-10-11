const mongoose = require('mongoose');
const Review = require("./review.js");

const listingschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point', // ✅ default value
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        default: 'cities',
        enum: ['mountain','farm','pool','forest','beach','cities'],
        required: true
    },
    bookings:[
        {
            
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
            
        }
    ]
   
});

// Cascade delete reviews when a listing is deleted
listingschema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
