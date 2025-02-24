import Joi from "joi";

const assetVerificationSchema = {
  create: Joi.object({
    tagNumber: Joi.string().required(),
    assetCondition: Joi.string().required(),
    assetStatus: Joi.string().required(),
    brand: Joi.string().required(),
    modal: Joi.string().required(),
    serialNumber: Joi.string().required(),
    faNumber: Joi.string().required(),
    extNumber: Joi.string(),
    locationId: Joi.string().required(),
    assetCategoryId: Joi.string().required(),
    assetOldTagNumber: Joi.string(),
    employeeId: Joi.string().required(),
    // Images will be handled by multer
  }),
  update: Joi.object({
    tagNumber: Joi.string(),
    assetCondition: Joi.string(),
    assetStatus: Joi.string(),
    brand: Joi.string(),
    modal: Joi.string(),
    serialNumber: Joi.string(),
    faNumber: Joi.string(),
    extNumber: Joi.string(),
    locationId: Joi.string(),
    assetCategoryId: Joi.string(),
    assetOldTagNumber: Joi.string(),
    employeeId: Joi.string(),
    // Images will be handled by multer
  }).min(1), // At least one field must be provided for update
};

export default assetVerificationSchema;
