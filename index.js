const express=require('express');
const app=express();
const port=8080;
const mongoose=require('mongoose');
const path=require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsmate = require('ejs-mate');
app.engine('ejs',ejsmate);
main().catch(err => console.log(err));
const Asyncwrap=require('./utilily/asyncwrap.js');
const ExpressError=require('./utilily/ExpressError.js');
let{listingschema}=require("./schema.js");
let{reviewschema}=require("./schema.js");
const Listing=require('./model/listing.js');
const Review=require("./model/review.js");
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
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.listen(port,()=>
{
    console.log(`server listening at port ${port}`);
});
//root
app.get('/',(req,res)=>
{
    res.send("root working");
});

app.get('/listings',Asyncwrap(async (req,res)=>
{
    const alllistings=await Listing.find({});
    res.render('./listings/index.ejs',{ alllistings });
        

}));
app.get('/listing/new',(req,res)=>
{
    res.render('./listings/new.ejs');
});
//show rout
app.get('/listing/:id',Asyncwrap(async (req,res)=>
{
 let id=req.params.id;
 const data= await Listing.findById(id).populate("review");
 res.render('./listings/show.ejs',{ data });
 
}));
//create
app.post("/listings", validatelisting, Asyncwrap(async (req, res, next) => {
    // req.body.listing contains the nested object from your form
    const newListing = new Listing(req.body.listing);

    await newListing.save();
    res.redirect(`/listing/${newListing._id}`);
}));

app.get('/listings/:id/edit',Asyncwrap(async(req,res)=>
{
    let id=req.params.id;
    const editdata= await Listing.findById(id);
    res.render('./listings/edit.ejs',{editdata});

}));
//update
app.put('/listings/:id', validatelisting, Asyncwrap(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, req.body.listing); 

  res.redirect(`/listing/${id}`);
}));
app.delete('/listings/:id',Asyncwrap(async(req,res)=>
{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');


}));
//review
app.post('/listing/:id/review',validatereview,Asyncwrap(async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newreview=new Review(req.body.review);
listing.review.push(newreview);
await newreview.save();
await listing.save();
res.redirect(`/listing/${listing._id}`);
}));
//delte review
app.delete('/listing/:id/review/:reviewId',Asyncwrap(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    res.redirect(`/listing/${id}`);
}));

app.all(/.*/,(req,res,next)=>
{
    return next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>
{
    let{status=500,message="something went wrong"}=err;
    res.status(status).render('Errors.ejs',{err});
})