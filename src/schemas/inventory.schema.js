import Joi from "joi";

const inventoryTypes = ["Asset", "Consumable"];

export const inventorySchema = Joi.object({
  assetLocation: Joi.string(),
  mainCatCode: Joi.string(),
  mainCatDesc: Joi.string(),
  mainDesc: Joi.string(),
  subCatCode: Joi.string(),
  subCatDesc: Joi.string(),
  assetCategory: Joi.string(),
  image: Joi.string().optional(),
  quantity: Joi.number().integer().min(1).default(1),
  serial: Joi.string().optional(),
  type: Joi.string()
    .valid(...inventoryTypes)
    .optional(),
  employeeId: Joi.string().optional(),
  extNumber: Joi.string().optional(),
  faNumber: Joi.string().optional(),
});
