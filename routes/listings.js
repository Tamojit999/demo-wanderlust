const express=require('express');
const router=express.Router();
const Asyncwrap=require('../utilily/asyncwrap.js');
const {isLoginedIn,isowner, validatelisting}=require('../middleware.js');
const listingcontroller=require('../controller/listings.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage });
//all_listing and create
router

.route('/')
.get(Asyncwrap(listingcontroller.index))

.post(isLoginedIn,upload.single('listing[image]'),validatelisting, Asyncwrap(listingcontroller.createlisting));

router.get('/category',Asyncwrap(listingcontroller.category));
router.get('/:id/user',isLoginedIn,Asyncwrap(listingcontroller.userlisting));
router.get('/:id/book',isLoginedIn,Asyncwrap(listingcontroller.booklisting));
router.get('/:id/mybooking',isLoginedIn,Asyncwrap(listingcontroller.mybookings));
router.get('/:id/customers',isLoginedIn,Asyncwrap(listingcontroller.customers));
router.post('/:id/book/payment',isLoginedIn,Asyncwrap(listingcontroller.paymentlisting));
router.post('/:id/payment-verification',isLoginedIn,Asyncwrap(listingcontroller.paymentverification));
//edit
router.get('/:id/edit',isLoginedIn,isowner,Asyncwrap(listingcontroller.editlisting));
router.get('/:id/review',isLoginedIn,Asyncwrap(listingcontroller.showreviews));
//create get
router.get('/new',isLoginedIn,listingcontroller.rendernewform);
//show,delete,update
router
.route('/:id')
.get(Asyncwrap(listingcontroller.showlisting))
.put(isLoginedIn,isowner,upload.single('listing[image]'), validatelisting, Asyncwrap(listingcontroller.updatelisting))
.delete(isLoginedIn,isowner,Asyncwrap(listingcontroller.deletelisting));



module.exports=router;