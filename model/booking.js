
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
