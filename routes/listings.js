const express=require('express');
const router=express.Router();
const Asyncwrap=require('../utilily/asyncwrap.js');
const {isLoginedIn,isowner, validatelisting}=require('../middleware.js');
const listingcontroller=require('../controller/listings.js');
//all_listing and create
router
.route('/')
.get(Asyncwrap(listingcontroller.index))
.post(validatelisting, Asyncwrap(listingcontroller.createlisting));
//create get
router.get('/new',isLoginedIn,listingcontroller.rendernewform);
//show,delete,update
router
.route('/:id')
.get(Asyncwrap(listingcontroller.showlisting))
.put(isLoginedIn,isowner, validatelisting, Asyncwrap(listingcontroller.updatelisting))
.delete(isLoginedIn,isowner,Asyncwrap(listingcontroller.deletelisting));

//edit
router.get('/:id/edit',isLoginedIn,isowner,Asyncwrap(listingcontroller.editlisting));

module.exports=router;