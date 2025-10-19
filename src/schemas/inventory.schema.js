import Joi from "joi";

import { InventoryScanningMode, InventoryStatus } from "../utils/app_enums.js";

const statuses = Object.values(InventoryStatus);
const scanningModes = Object.values(InventoryScanningMode);

export const inventoryTransactionSchema = Joi.object({
  transactionId: Joi.string().optional(),
  transactionDate: Joi.date().optional(),
  transactionName: Joi.string().required().messages({
    "any.required": "Transaction name is required",
    "string.empty": "Transaction name cannot be empty",
  }),
  scanningMode: Joi.string()
    .required()
    .valid(...scanningModes)
    .optional(),
  createdBy: Joi.string().optional().allow(null, ""),
  status: Joi.string()
    .valid(...statuses)
    .optional()
    .default(InventoryStatus.COMPLETED),
});

export const inventoryItemsSchema = Joi.object({
  verifiedAssetsId: Joi.array()
    .items(Joi.string().required())
    .required()
    .messages({
      "any.required": "Verified Assets ID array is required",
      "array.base": "Verified Assets ID must be an array of strings",
    }), // ['itemId1', 'itemId2', ...]
  inventoryId: Joi.string().required().messages({
    "any.required": "Inventory ID is required",
    "string.empty": "Inventory ID cannot be empty",
  }),
});
