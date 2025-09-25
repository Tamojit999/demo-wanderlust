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
   const dataWithOwner = initdata.data.map((obj) => ({
  ...obj,
  owner: "68d3a9c393020cc37478977b"
})); // new array craeted owner

await Listing.insertMany(dataWithOwner);
console.log('data saved');

}
initDB();