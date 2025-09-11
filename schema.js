const Joi=require('joi');
module.exports.listingschema=Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        contry:Joi.string().required(),
        price:Joi.number().required()

        
    }).required(),
});