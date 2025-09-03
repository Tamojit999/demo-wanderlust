const express=require('express');
const app=express();
const port=8080;
const mongoose=require('mongoose');
const path=require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "public")));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsmate = require('ejs-mate');
app.engine('ejs',ejsmate);
main().catch(err => console.log(err));

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
const Listing=require('./model/listing.js');
app.get('/listings',async (req,res)=>
{
    const alllistings=await Listing.find({});
    res.render('./listings/index.ejs',{ alllistings });
        

});
app.get('/listing/new',(req,res)=>
{
    res.render('./listings/new.ejs');
});
app.get('/listing/:id',async (req,res)=>
{
 let id=req.params.id;
 const data= await Listing.findById(id);
 res.render('./listings/show.ejs',{ data });
 
});
app.post('/listing',async (req,res)=>
{
   
    let { title,image_url,price,location,country,description }=req.body;
   await Listing.insertOne({title:title,image:{url:image_url},price:price,location:location,country:country,description:description});
    res.redirect('/listings');

});
app.get('/listings/:id/edit',async(req,res)=>
{
    let id=req.params.id;
    const editdata= await Listing.findById(id);
    res.render('./listings/edit.ejs',{editdata});

});
app.put('/listings/:id', async (req, res) => {
  let id = req.params.id;
  let { title, image, price, location, country, description } = req.body;
  await Listing.findByIdAndUpdate(id, {
    title,
    image: { url: image },
    price,
    location,
    country,
    description
  });
  res.redirect(`/listing/${id}`);
});
app.delete('/listings/:id',async(req,res)=>
{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');


});
