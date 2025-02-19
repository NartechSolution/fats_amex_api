import Joi from "joi";

export const generateAssetTagsSchema = Joi.object({
  assetCaptureIds: Joi.array().items(Joi.string().required()).required(),
}).required();

export const assetTagSchema = Joi.object({
  tagNumber: Joi.string().required(),
  assetCaptureId: Joi.string().required(),
}).required();
