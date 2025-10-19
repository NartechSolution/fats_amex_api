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
    }),
  inventoryId: Joi.string().required().messages({
    "any.required": "Inventory ID is required",
    "string.empty": "Inventory ID cannot be empty",
  }),
});

export const inventoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.base": "Limit must be a number",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 100",
    }),
  search: Joi.string().optional().allow("").messages({
    "string.base": "Search must be a string",
  }),
  sortBy: Joi.string().optional().default("createdAt").messages({
    "string.base": "SortBy must be a string",
  }),
  order: Joi.string().valid("asc", "desc").optional().default("desc").messages({
    "string.base": "Order must be a string",
    "any.only": "Order must be either 'asc' or 'desc'",
  }),
  status: Joi.string()
    .valid(...statuses)
    .optional()
    .messages({
      "any.only": `Status must be one of: ${statuses.join(", ")}`,
    }),
  createdBy: Joi.string().optional().allow("").messages({
    "string.base": "CreatedBy must be a string",
  }),
});

export const verifiedAssetsByInventoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.base": "Limit must be a number",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 100",
    }),
  search: Joi.string().optional().allow("").messages({
    "string.base": "Search must be a string",
  }),
  sortBy: Joi.string().optional().default("createdAt").messages({
    "string.base": "SortBy must be a string",
  }),
  order: Joi.string().valid("asc", "desc").optional().default("desc").messages({
    "string.base": "Order must be a string",
    "any.only": "Order must be either 'asc' or 'desc'",
  }),
});
