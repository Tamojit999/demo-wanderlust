const mongoose=require('mongoose');
const listingschema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String
        },
        image:{
            type:String,
            default:"https://static.thenounproject.com/png/1077596-200.png",
            set:(v)=> v===""?"https://static.thenounproject.com/png/1077596-200.png":v,
        },
        price:{
            type:Number
        },
        location:{
            type:String
        },
        country:{
            type:String
        }
    }
);
const listing=mongoose.model("listing",listingschema);
module.exports=listing;