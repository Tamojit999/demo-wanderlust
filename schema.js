const Joi=require('joi');
module.exports.listingschema=Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
         image: Joi.object({
      url: Joi.string().required()
    }).allow("",null),
        location:Joi.string().required(),
        country:Joi.string().required(),
        category:Joi.string().required(),
        price:Joi.number().required()

        
    }).required(),
});
module.exports.reviewschema=Joi.object({
    review : Joi.object({
        rating:Joi.number().required().min(0).max(5),
        comment: Joi.string().required(),
    }).required(),
});