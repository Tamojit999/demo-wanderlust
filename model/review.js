const { required } = require("joi");
const Listing=require('../model/listing.js');
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"

    }
});

module.exports = mongoose.model("Review", reviewSchema);
