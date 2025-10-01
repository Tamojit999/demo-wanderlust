const mongoose = require('mongoose');
const Review = require("./review.js");
const listingschema = new mongoose.Schema(
    {
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
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    }
);
listingschema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});
const listing = mongoose.model("listing", listingschema);
module.exports = listing;