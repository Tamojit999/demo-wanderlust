const express=require('express');
const router = express.Router({ mergeParams: true }); // 👈 add mergeParams
const Asyncwrap=require('../utilily/asyncwrap.js');
const Listing=require('../model/listing.js');
const ExpressError=require('../utilily/ExpressError.js');
let{reviewschema}=require("../schema.js");
const Review=require("../model/review.js");
const validatereview=(req,res,next)=>
{
    let {error}=reviewschema.validate(req.body);
    if(error)
    {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }
    else{
        next();
    }

}
//delte review
router.delete('/:reviewId',Asyncwrap(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
      req.flash('success', 'review deleted');
    res.redirect(`/listings/${id}`);
}));

router.post('/',validatereview,Asyncwrap(async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newreview=new Review(req.body.review);
listing.review.push(newreview);
await newreview.save();
await listing.save();
  req.flash('success', 'review saved');
res.redirect(`/listings/${listing._id}`);
}));
module.exports=router;