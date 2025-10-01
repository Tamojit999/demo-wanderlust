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

//create get
router.get('/new',isLoginedIn,listingcontroller.rendernewform);
//show,delete,update
router
.route('/:id')
.get(Asyncwrap(listingcontroller.showlisting))
.put(isLoginedIn,isowner,upload.single('listing[image]'), validatelisting, Asyncwrap(listingcontroller.updatelisting))
.delete(isLoginedIn,isowner,Asyncwrap(listingcontroller.deletelisting));

//edit
router.get('/:id/edit',isLoginedIn,isowner,Asyncwrap(listingcontroller.editlisting));

module.exports=router;