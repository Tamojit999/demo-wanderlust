
const Listing=require('../model/listing.js');
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });
module.exports.index=async (req,res)=>
{
    const alllistings=await Listing.find({});
    res.render('./listings/index.ejs',{ alllistings });
};
module.exports.rendernewform=(req,res)=>
{
    res.render('./listings/new.ejs');
};
module.exports.showlisting=async(req,res) => {
    let id = req.params.id;
    const data = await Listing.findById(id).populate({path:"review",
        populate:{
            path:"auther" //nested populate
        },
    }).populate('owner');
    if(!data) {
        req.flash('error','listing not found');
        return res.redirect(`/listings`); // return stops execution
    }
    res.render('./listings/show.ejs',{data});
};
module.exports.createlisting=async (req, res) => {
    let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send();
  
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
   
    req.flash('success', 'New listing saved');
    res.redirect(`/listings`);
};
module.exports.editlisting=async(req,res)=>
{
    let id=req.params.id;
    const editdata= await Listing.findById(id);
    if(!editdata)
 {
     req.flash('error','listing not found');
    res.redirect(`/listings`);
 }
 else{
    let originalurl=editdata.image.url;
    originalurl = originalurl.replace("/upload/", "/upload/h_300,w_250,c_fill/");
    res.render('./listings/edit.ejs',{editdata,originalurl});
 }
};
module.exports.updatelisting=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
    if(typeof req.file !== 'undefined'){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
  req.flash('success', 'listing updated');
  res.redirect(`/listings/${id}`);
};
module.exports.deletelisting=async(req,res)=>
{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'listing deleted');
    res.redirect('/listings');
};