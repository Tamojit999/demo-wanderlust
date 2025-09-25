const Listing = require('./model/listing.js');
const Review = require("./model/review.js");
let { listingschema, reviewschema } = require("./schema.js");
const ExpressError = require('./utilily/ExpressError.js');
module.exports.isLoginedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        }
        req.flash('error', 'you must be logged in first!');
        return res.redirect('/login');
    }

    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isowner = async (req, res, next) => {
   
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    if (!listing.owner || !res.locals.curr || !listing.owner.equals(res.locals.curr._id)) {
        req.flash('error', 'You are not the owner of this listing');
        return res.redirect(`/listings/${id}`);
    }

    next();
};
module.exports.isreviewauther = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.auther.equals(res.locals.curr._id)) {
        req.flash('error', 'you are not the auther of this review');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errmsg);
    }
    else {
        next();
    }
}
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errmsg);
    }
    else {
        next();
    }

}
