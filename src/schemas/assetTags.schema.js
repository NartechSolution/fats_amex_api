import Joi from "joi";

export const generateAssetTagsSchema = Joi.object({
  assetCaptureIds: Joi.array().items(Joi.string().required()).required(),
}).required();

export const assetTagSchema = Joi.object({
  tagNumber: Joi.string().required(),
  assetCaptureId: Joi.string().required(),
}).required();

export const updateAssetTagSchema = Joi.object({
  tagNumber: Joi.string().optional(),
  assetCaptureId: Joi.string().optional(),
  assetCapturePDAId: Joi.string().allow(null).optional(),
  isVerified: Joi.boolean().optional(),
  assetCapture: Joi.object({
    locationId: Joi.string().optional(),
    fatsCategoryId: Joi.string().optional(),
    assetDescription: Joi.string().allow("").optional(),
    serialNumber: Joi.string().allow(null, "").optional(),
    assetTag: Joi.string().allow(null, "").optional(),
    quantity: Joi.number().integer().optional(),
    employeeId: Joi.string().allow(null).optional(),
    extNumber: Joi.string().allow(null, "").optional(),
    faNumber: Joi.string().allow("").optional(),
    brand: Joi.string().allow("").optional(),
    modal: Joi.string().allow("").optional(),
    isVerified: Joi.boolean().optional(),
    isGenerated: Joi.boolean().optional(),
  }).optional(),
}).min(1);
