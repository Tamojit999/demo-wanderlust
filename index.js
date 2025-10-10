if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const express = require('express');

const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utilily/ExpressError.js');
const listingroute = require('./routes/listings.js');
const reviewroute = require('./routes/reviews.js');
const userroute = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user.js');

const dburl =process.env.ATLASDB_URL;

// --- Database connection ---
async function main() {
  await mongoose.connect(dburl);
 
}
main().catch(err => console.log(err));

// --- App setup ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', ejsmate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.use(methodOverride('_method'));

const store= MongoStore.create({
   mongoUrl:dburl,
   crypto:{
    secret: process.env.SECRET
   },
   touchAfter:24*3600,
   

});
store.on("error",(err)=>
{
  console.log("error in mongo session store",err);
});
const sessionoption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
};




app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// --- Passport config ---
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Flash middleware ---
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.curr = req.user;
  next();
});

// --- Routes ---
app.use('/listings', listingroute);
app.use('/listings/:id/review', reviewroute);
app.use('/', userroute);
// Catch-all for unhandled routes
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render('Errors.ejs', { err });
});


// --- Server listen ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

