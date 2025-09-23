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
const listing=require('./routes/listings.js');
const review=require('./routes/reviews.js');
const session = require('express-session');
const flash=require('connect-flash');
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const sessionoption={
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+1000*24*7*60*60,
    maxAge: 1000*24*7*60*60,
    httpOnly: true
  }
};
app.listen(port,()=>
{
    console.log(`server listening at port ${port}`);
});

app.use(session(sessionoption));
app.use(flash());
app.use((req,res,next)=>
{
     res.locals.success=req.flash('success');
    res.locals.err=req.flash('err');
     next();

});
app.use('/listings',listing);
app.use('/listings/:id/review',review);
app.all(/.*/,(req,res,next)=>
{
    return next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>
{
    let{status=500,message="something went wrong"}=err;
    res.status(status).render('Errors.ejs',{err});
})