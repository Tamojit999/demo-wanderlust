const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // prevent duplicate emails
        lowercase: true,
    },
    phone_no: {
        type: String,
    },
    bio: {
        type: String,
        trim: true,
    },
    dateofbirth: {
        type: Date,
    },
    location: {
        type: String,
        trim: true,
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
});

// Add username + password automatically
userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userschema);
