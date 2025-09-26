const express=require('express');
const router=express.Router();
const Asyncwrap=require('../utilily/asyncwrap.js');
const passport=require('passport');
let{saveRedirectUrl}=require('../middleware.js');
const usercontroller=require('../controller/users.js')
//signup
router
.route("/signup")
.get(usercontroller.signupform)
.post(Asyncwrap(usercontroller.signup));
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
router.get('/logout',usercontroller.logout);



module.exports=router;