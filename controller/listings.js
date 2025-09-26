const Listing=require('../model/listing.js');

module.exports.index=async (req,res)=>
{
    const alllistings=await Listing.find({});
    res.render('./listings/index.ejs',{ alllistings });
        

};
module.exports.rendernewform=(req,res)=>
{
    
    res.render('./listings/new.ejs');
};
module.exports.showlisting=async (req,res) => {
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
};
module.exports.createlisting=async (req, res, next) => {
    // req.body.listing contains the nested object from your form
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;

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
    res.render('./listings/edit.ejs',{editdata});
 }

};
module.exports.updatelisting=async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, req.body.listing); 
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