const express=require('express');
const router=express.Router();
const Asyncwrap=require('../utilily/asyncwrap.js');
const passport=require('passport');
let{saveRedirectUrl}=require('../middleware.js');
const usercontroller=require('../controller/users.js')

//signup get
router.get("/signup",usercontroller.signupform);
//signup post
router.post('/signup',Asyncwrap(usercontroller.signup));
//login get
router.get("/login",usercontroller.loginform);
//login post
router.post('/login',
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true   // needed for error flash
    }),usercontroller.login);
router.get('/logout',usercontroller.logout);



module.exports=router;