const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
res.send("/user");
});
router.get('/:id',(req,res)=>{
res.send("/user/:id");
});
router.delete('/delete',(req,res)=>{
res.send("/user/delete");
});

module.exports=router;