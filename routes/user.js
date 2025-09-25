const express=require('express');
const router=express.Router();
const User=require('../model/user.js');
const Asyncwrap=require('../utilily/asyncwrap.js');
const passport=require('passport');
let{saveRedirectUrl}=require('../middleware.js');

//signup get
router.get("/signup",(req,res)=>
{
    res.render('./users/signup.ejs')
});
//signup post
router.post('/signup',Asyncwrap(async(req,res)=>
{
    try{
    let {username,password,email}=req.body;
    const newuser=new User({username,email});
    const registeruser=await User.register(newuser,password);
    req.login(registeruser,(err)=>
    {
        if(err)
        {
           return next(err);
        }
        req.flash('success','welcome to wanderlust');
        res.redirect(`/listings`);

    });
   
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
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true   // needed for error flash
    }),
    (req, res) => {
        req.flash('success', 'Welcome back!'); 
        let redirecturl=res.locals.redirectUrl || '/listings'; //checking is the redirect url is empty or not  if yes the save redirect to /listings
        return res.redirect(redirecturl);
    });
router.get('/logout',(req,res,next)=>
{
    req.logOut((err)=>
    {
        if(err)
        {
           return next(err);
        }
        req.flash('success',"logout successfully");
        res.redirect(`/listings`);

    });

});



module.exports=router;