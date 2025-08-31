const initdata = require('./data.js');
const Listing=require('../model/listing.js');
const mongoose=require('mongoose');
main().catch(err => console.log(err));
async function main() 
{
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initDB= async ()=>
{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data is saved");

}
initDB();