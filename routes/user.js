const express=require('express');
const router=express.Router();
const User=require('../model/user.js');
const Asyncwrap=require('../utilily/asyncwrap.js');
const passport=require('passport');

//signup get
router.get("/signup",(req,res)=>
{
    res.render('./users/signup.ejs')
});
//ssignup post
router.post('/signup',Asyncwrap(async(req,res)=>
{
    try{
    let {username,password,email}=req.body;
    const newuser=new User({username,email});
    await User.register(newuser,password);
    req.flash('success','welcome to wanderlust');
   res.redirect(`/listings`);
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
}));
//login get
router.get("/login",(req,res)=>
{
    res.render('./users/login.ejs')
});
//login post
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true   // needed for error flash
    }),
    (req, res) => {
        req.flash('success', 'Welcome back!'); 
        res.redirect(`/listings`);
    });




module.exports=router;