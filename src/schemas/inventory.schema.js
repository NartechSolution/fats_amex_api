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
