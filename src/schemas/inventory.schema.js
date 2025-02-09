import Joi from "joi";

const inventoryTypes = ["Assset", "Consumable"];

export const inventorySchema = Joi.object({
  assetLocation: Joi.string().required(),
  mainCatCode: Joi.string().required(),
  mainCatDesc: Joi.string().required(),
  mainDesc: Joi.string().required(),
  subCatCode: Joi.string().required(),
  subCatDesc: Joi.string().required(),
  assetCategory: Joi.string().required(),
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
