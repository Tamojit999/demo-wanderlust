const User=require('../model/user.js');
module.exports.signupform=(req,res)=>
{
    res.render('./users/signup.ejs')
};
module.exports.signup=async(req,res)=>
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
};
module.exports.loginform=(req,res)=>
{
    res.render('./users/login.ejs')
};
module.exports.login=(req, res) => {
        req.flash('success', 'Welcome back!'); 
        let redirecturl=res.locals.redirectUrl || '/listings'; //checking is the redirect url is empty or not  if yes the save redirect to /listings
        return res.redirect(redirecturl);
};
module.exports.logout=(req,res,next)=>
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

};