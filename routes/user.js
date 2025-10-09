const express=require('express');
const router=express.Router();
const Asyncwrap=require('../utilily/asyncwrap.js');
const passport=require('passport');
let{isLoginedIn,saveRedirectUrl}=require('../middleware.js');
const usercontroller=require('../controller/users.js');
const multer  = require('multer');
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage });
//signup
router
.route("/signup")
.get(usercontroller.signupform)
.post(upload.single('image'),Asyncwrap(usercontroller.signup));
//login
router
.route("/login")
.get(usercontroller.loginform)
.post(saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true   // needed for error flash
    }),usercontroller.login);
//logout
router.get('/logout',isLoginedIn,usercontroller.logout);
//profile
router.get('/profile',isLoginedIn,usercontroller.profile);
//owner
router.get('/owner',usercontroller.owner);
router.get('/terms',usercontroller.terms);
router.get('/about',usercontroller.about);
router.get('/privacy',usercontroller.privacy);




module.exports=router;