const instance = require('../utilily/razorpay.js');
const Review = require("../model/review.js");
const Listing = require('../model/listing.js');
const Booking = require('../model/booking.js');
const crypto = require('crypto');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });
module.exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const totalItems = await Listing.countDocuments();
    const alllistings = await Listing.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    // Total pages
    const totalPages = Math.ceil(totalItems / limit);
    res.render("listings/index.ejs", {
      alllistings,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  };


};
//category
module.exports.category = async (req, res) => {
  const name = req.query.name;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const totalItems = await Listing.countDocuments({ category: name });
  const alllistings = await Listing.find({ category: name })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const totalPages = Math.ceil(totalItems / limit);

  res.render('listings/index.ejs', {
    alllistings,
    currentPage: page,
    totalPages,
    category: name,
  });

};
module.exports.rendernewform = (req, res) => {
  res.render('./listings/new.ejs');
};
module.exports.showlisting = async (req, res) => {
  let id = req.params.id;
  const data = await Listing.findById(id).populate({
    path: "review",
    populate: {
      path: "auther" //nested populate
    },
  }).populate('owner');
  if (!data) {
    req.flash('error', 'listing not found');
    return res.redirect(`/listings`); // return stops execution
  }
  res.render('./listings/show.ejs', { data });
};
module.exports.createlisting = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();

  req.flash('success', 'New listing saved');
  res.redirect(`/listings`);
};
module.exports.editlisting = async (req, res) => {
  let id = req.params.id;
  const editdata = await Listing.findById(id);
  if (!editdata) {
    req.flash('error', 'listing not found');
    res.redirect(`/listings`);
  }
  else {
    let originalurl = editdata.image.url;
    originalurl = originalurl.replace("/upload/", "/upload/h_300,w_250,c_fill/");
    res.render('./listings/edit.ejs', { editdata, originalurl });
  }
};
module.exports.updatelisting = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
  }
  listing.geometry = response.body.features[0].geometry;
  await listing.save();
  req.flash('success', 'listing updated');
  res.redirect(`/listings/${id}`);
};
module.exports.deletelisting = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'listing deleted');
  res.redirect('/listings');
};
module.exports.userlisting = async (req, res) => {
  let { id } = req.params;
  const userlistings = await Listing.find({ owner: id });
  res.render('./listings/profilelisting.ejs', { userlistings });
};
module.exports.showreviews = async (req, res) => {


  let id = req.params.id;
  const reviews = await Review.find({ auther: id })
    .populate("auther")   // populate user info
    .populate("listing"); // populate listing info

  res.render('listings/showreviews', { reviews });


};
module.exports.booklisting = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  res.render('listings/bookingpage', { listing });
};
module.exports.paymentlisting = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    const { bookedfrom, bookedto } = req.body;
    const fromDate = new Date(bookedfrom);
    const toDate = new Date(bookedto);
    const durationInDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);

    if (durationInDays <= 0) {
      req.flash('error', 'Invalid booking dates');
      return res.redirect(`/listings/${id}/book`);
    }

    const totalPrice = listing.price * durationInDays;


    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    const options = {
      amount: Number(totalPrice * 100), // in paise
      currency: "INR",
      receipt: `receipt_${id}`,
    };
    const order = await instance.orders.create(options);

    // Send order info to EJS page
    res.render('listings/checkout.ejs', { listing, totalPrice, order, key: process.env.RAZORPAY_API_KEY });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
module.exports.paymentverification = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // create booking
      const newBooking = new Booking({
        listing: listing._id,
        customer: req.user._id,        // assuming you're using Passport.js
        owner: listing.owner,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });

      await newBooking.save();
      listing.bookings.push(newBooking._id);
      await listing.save();

      req.flash('success', 'Booking confirmed successfully!');
      return res.redirect('/listings');
    } else {
      req.flash('error', 'Payment verification failed. Please try again.');
      return res.redirect('/listings');
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect('/listings');
  }
};
module.exports.mybookings = async (req, res) => {
  try {
    const { id } = req.params; // customer ID

    const bookings = await Booking.find({ customer: id })
      .populate('listing')   // get full listing data


    const allListings = bookings.map(b => b.listing);

    res.render('bookings/myBookings', { allListings });
  } catch (err) {
    console.error('Error fetching customer bookings:', err);
    req.flash('error', 'Unable to fetch your bookings.');
    res.redirect('/listings');
  }

};
module.exports.customers=async(req,res)=>
{
  const { id } = req.params; // customer ID

    const bookings = await Booking.find({ owner: id })
      .populate('customer')
      .populate('listing'); 
      const allcustomers = bookings.map(b => ({
      customerName: b.customer?.username,
      customerEmail: b.customer?.email,
      listingTitle: b.listing?.title,
      bookingId: b._id
    }));
    res.render('bookings/customers',{allcustomers});
  

};