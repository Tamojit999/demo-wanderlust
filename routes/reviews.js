const express=require('express');
const router = express.Router({ mergeParams: true }); // 👈 add mergeParams
const Asyncwrap=require('../utilily/asyncwrap.js');
const reviewscontroller=require('../controller/reviews.js')
const {isLoginedIn,validatereview,isreviewauther}=require('../middleware.js');
//create
router.post('/',isLoginedIn,validatereview,Asyncwrap(reviewscontroller.create_reviews));



//delete review
router.delete('/:reviewId',isLoginedIn,isreviewauther,Asyncwrap(reviewscontroller.deletereviews));



module.exports=router;