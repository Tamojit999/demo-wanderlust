const express=require('express');
const router=express.Router();
const Asyncwrap=require('../utilily/asyncwrap.js');
const Listing=require('../model/listing.js');
let{listingschema}=require("../schema.js");
const ExpressError=require('../utilily/ExpressError.js');
const validatelisting=(req,res,next)=>
{
    let {error}=listingschema.validate(req.body);
    if(error)
    {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errmsg);
    }
    else{
        next();
    }
}

router.get('/',Asyncwrap(async (req,res)=>
{
    const alllistings=await Listing.find({});
    res.render('./listings/index.ejs',{ alllistings });
        

}));
router.get('/new',(req,res)=>
{
    res.render('./listings/new.ejs');
});
//show rout
router.get('/:id',Asyncwrap(async (req,res)=>
{
 let id=req.params.id;
 const data= await Listing.findById(id).populate("review");
 if(!data)
 {
     req.flash('err','listing not found');
    res.redirect(`/listings`);

 }
 else{
 res.render('./listings/show.ejs',{ data });
 }
 
}));
//create
router.post("/", validatelisting, Asyncwrap(async (req, res, next) => {
    // req.body.listing contains the nested object from your form
    const newListing = new Listing(req.body.listing);

    await newListing.save();
 req.flash('success', 'New listing saved');
    res.redirect(`/listings`);
}));

router.get('/:id/edit',Asyncwrap(async(req,res)=>
{
    let id=req.params.id;
    const editdata= await Listing.findById(id);
    if(!editdata)
 {
     req.flash('err','listing not found');
    res.redirect(`/listings`);

 }
 else{
    res.render('./listings/edit.ejs',{editdata});
 }

}));
//update
router.put('/:id', validatelisting, Asyncwrap(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, req.body.listing); 
  req.flash('success', 'listing updated');
  res.redirect(`/listings/${id}`);
}));
router.delete('/:id',Asyncwrap(async(req,res)=>
{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'listing deleted');
    res.redirect('/listings');


}));
module.exports=router;