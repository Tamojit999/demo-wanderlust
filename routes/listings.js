const express=require('express');
const router=express.Router();
const Asyncwrap=require('../utilily/asyncwrap.js');
const Listing=require('../model/listing.js');
const {isLoginedIn,isowner, validatelisting}=require('../middleware.js');


router.get('/',Asyncwrap(async (req,res)=>
{
    const alllistings=await Listing.find({});
    res.render('./listings/index.ejs',{ alllistings });
        

}));
//create get
router.get('/new',isLoginedIn,(req,res)=>
{
    
    res.render('./listings/new.ejs');
});
//show rout
router.get('/:id', Asyncwrap(async (req,res) => {
    let id = req.params.id;
    const data = await Listing.findById(id).populate({path:"review",
        populate:{
            path:"auther"       //nested populate
        },
    }).populate('owner');
    if(!data) {
        req.flash('error','listing not found');
        return res.redirect(`/listings`); // ✅ return stops execution
    }
    res.render('./listings/show.ejs',{ data });
}));

//create post
router.post("/", validatelisting, Asyncwrap(async (req, res, next) => {
    // req.body.listing contains the nested object from your form
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;

    await newListing.save();
 req.flash('success', 'New listing saved');
    res.redirect(`/listings`);
}));

router.get('/:id/edit',isLoginedIn,isowner,Asyncwrap(async(req,res)=>
{
    let id=req.params.id;
    const editdata= await Listing.findById(id);
    if(!editdata)
 {
     req.flash('error','listing not found');
    res.redirect(`/listings`);

 }
 else{
    res.render('./listings/edit.ejs',{editdata});
 }

}));
//update
router.put('/:id',isLoginedIn,isowner, validatelisting, Asyncwrap(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, req.body.listing); 
  req.flash('success', 'listing updated');
  res.redirect(`/listings/${id}`);
}));
router.delete('/:id',isLoginedIn,isowner,Asyncwrap(async(req,res)=>
{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'listing deleted');
    res.redirect('/listings');


}));
module.exports=router;