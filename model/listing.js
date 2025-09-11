const mongoose=require('mongoose');
const listingschema = new mongoose.Schema(
    {
        title:{
            type:String,
            required : true
        },
        description:{
            type:String
        },
        image:{
            filename:{
                type:String,
                default:"listingimage"
            },
            
            url: String
        },
        price:{
            type:Number,
            required: true
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