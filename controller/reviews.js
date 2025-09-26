const Listing=require('../model/listing.js');
const Review=require("../model/review.js");
module.exports.deletereviews=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
      req.flash('success', 'review deleted');
    res.redirect(`/listings/${id}`);
};
module.exports.create_reviews=async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newreview=new Review(req.body.review);
newreview.auther=req.user._id;
listing.review.push(newreview);
await newreview.save();
await listing.save();
  req.flash('success', 'review saved');
res.redirect(`/listings/${listing._id}`);
};