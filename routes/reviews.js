const express=require('express');
const router = express.Router({ mergeParams: true }); // 👈 add mergeParams
const Asyncwrap=require('../utilily/asyncwrap.js');
const Listing=require('../model/listing.js');
const Review=require("../model/review.js");
const {isLoginedIn,validatereview,isreviewauther}=require('../middleware.js');
//delte review
router.delete('/:reviewId',isLoginedIn,isreviewauther,Asyncwrap(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
      req.flash('success', 'review deleted');
    res.redirect(`/listings/${id}`);
}));

router.post('/',isLoginedIn,validatereview,Asyncwrap(async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newreview=new Review(req.body.review);
newreview.auther=req.user._id;
listing.review.push(newreview);
await newreview.save();
await listing.save();
  req.flash('success', 'review saved');
res.redirect(`/listings/${listing._id}`);
}));
module.exports=router;