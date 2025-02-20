import Joi from "joi";

export const assetCaptureSchema = Joi.object({
  locationId: Joi.string().required(),
  fatsCategoryId: Joi.string().required(),
  assetDescription: Joi.string().optional(),
  serialNumber: Joi.string().optional(),
  assetTag: Joi.string().optional(),
  quantity: Joi.number().integer().optional(),
  employeeId: Joi.string().optional(),
  extNumber: Joi.string().optional(),
  faNumber: Joi.string().optional(),
  brand: Joi.string().optional(),
  modal: Joi.string().optional(),
  isVerified: Joi.boolean().optional(),
  isGenerated: Joi.boolean().optional(),
}).min(1);
