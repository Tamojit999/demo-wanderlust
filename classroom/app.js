const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session'); // ✅ correct
const path=require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const flash=require('connect-flash');
const sessionoption={
  secret: "mysecret",
  resave: false,
  saveUninitialized: true
};

app.use(session(sessionoption));
 app.use(flash());
app.get('/register',(req,res)=>
{
  let{name='anonymus'}=req.query;
  req.session.name=name;
  if(name=='anonymus'){
    req.flash('err','resgistration not done');
  }
  else{
req.flash('success','resgistration done');
  }
  
 res.redirect('/hello');

});
app.get('/hello',(req,res)=>{
  res.locals.success=req.flash('success');
  res.locals.err=req.flash('err');
  res.render('page.ejs',{name:req.session.name});
}

);
app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
