import Joi from "joi";

export const wbsModifierSchema = Joi.object({
  name: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  price: Joi.number().min(0).allow(null),
  stock: Joi.number().integer().min(0).allow(null),
  isActive: Joi.boolean().default(true),
});
