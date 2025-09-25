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
const ExpressError=require('./utilily/ExpressError.js');
const listingroute=require('./routes/listings.js');
const reviewroute=require('./routes/reviews.js');
const userroute=require('./routes/user.js');
const session = require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./model/user.js');
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

//authentication 

app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());//using session with passport so that do not needto logoin in every page
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//store the user info when the session start
passport.deserializeUser(User.deserializeUser());//remove the info when the session ends





// use for message flash massages

app.use((req,res,next)=>
{
     res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.curr=req.user;
     next();

});
/*
app.get("/demouser",async(req,res)=>
{
  let fakeuser=new User({
    email:"tamojit@gmail.com",
    username:'tamojit99',
   
  });
let register=await User.register(fakeuser,"hello"); // this will save the user in the dasebase with this password
res.send(register);
});
*/


app.use('/listings',listingroute);
app.use('/listings/:id/review',reviewroute);
app.use('/',userroute);
app.all(/.*/,(req,res,next)=>
{
    return next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>
{
    let{status=500,message="something went wrong"}=err;
    res.status(status).render('Errors.ejs',{err});
})