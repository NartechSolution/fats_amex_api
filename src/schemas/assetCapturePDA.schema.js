import Joi from "joi";

export const assetCapturePDASchema = Joi.object({
  locationId: Joi.string().required(),
  fatsCategoryId: Joi.string().required(),
  assetDescription: Joi.string().allow("").optional(),
  serialNumber: Joi.string().allow("").optional(),
  assetTag: Joi.string().allow("").optional(),
  quantity: Joi.number().integer().optional(),
  employeeId: Joi.string().allow("").optional(),
  extNumber: Joi.string().allow("").optional(),
  faNumber: Joi.string().allow("").optional(),
  brand: Joi.string().allow("").optional(),
  modal: Joi.string().allow("").optional(),
  isVerified: Joi.boolean().optional(),
  isGenerated: Joi.boolean().optional(),
}).min(1);
