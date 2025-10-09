const User = require('../model/user.js');
const Listing = require('../model/listing.js');
const Review=require("../model/review.js");
module.exports.signupform = (req, res) => {
  res.render('users/signup'); // no need for './'
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, password, email, location, phone_no, bio, dateofbirth } = req.body;

    // 🔹 Basic validation
    if (!username || !password || !email) {
      req.flash('error', 'Username, email, and password are required.');
      return res.redirect('/signup');
    }

    // 🔹 Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash('error', 'Username or email already exists. Please choose another.');
      return res.redirect('/signup');
    }

    // 🔹 Create user object
    const newUser = new User({
      username,
      email,
      location,
      phone_no,
      bio,
      dateofbirth: dateofbirth ? new Date(dateofbirth) : null
    });

    // 🔹 Attach image if uploaded
    if (req.file) {
      newUser.image = {
        url: req.file.path,      // for Cloudinary this will be the secure URL
        filename: req.file.filename
      };
    }

    // 🔹 Register user with password (passport-local-mongoose)
    const registeredUser = await User.register(newUser, password);

    // 🔹 Log the user in immediately
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Wanderlust!');
      res.redirect('/listings');
    });

  } catch (e) {
    console.error("Signup error:", e);

    if (e.code === 11000) {
      req.flash('error', 'Username or email already exists.');
    } else {
      req.flash('error', e.message);
    }
    res.redirect('/signup');
  }
};


module.exports.loginform = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!');
  let redirecturl = res.locals.redirectUrl || '/listings';
  return res.redirect(redirecturl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);

    req.flash('success', "Logout successfully");
    res.redirect('/listings');
  });
};

module.exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);  
    res.render('users/profile', { user });
  } catch (err) {
    next(err);
  }
};

module.exports.owner = async (req, res, next) => {
  try {
    const name = req.query.name;
    const user = await User.findOne({ username: name });

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/listings');
    }
    

    const userslisting = await Listing.find({ owner: user._id });


    // Count all reviews for listings owned by this user
  const reviewsCount = await Review.countDocuments({ listing: { $in: userslisting.map(l => l._id) } });
    res.render("users/owner", {
    user,
    userslisting,
    reviewsCount 
  });

  } catch (err) {
    next(err);
  }
};
module.exports.terms=async(req,res)=>
{
  res.render('users/termsheet');

};
module.exports.about=async(req,res)=>
{
  res.render('users/about');

};
module.exports.privacy=async(req,res)=>
{
  res.render('users/privary');

};
