import Joi from "joi";

import { ASSET_TRANSACTION_TYPES } from "../constants/enums.js";
import { generateTransactionId } from "../utils/generateUniqueId.js";

const types = Object.values(ASSET_TRANSACTION_TYPES);

const assetTransactionSchema = {
  create: Joi.object({
    transactionId: Joi.string()
      .optional()
      .default(() => generateTransactionId()),
    type: Joi.string()
      .valid(...types)
      .optional()
      .messages({
        "any.only": `Type must be one of the following: ${types.join(", ")}`,
      }),
    name: Joi.string().trim().min(1).max(255).optional().messages({
      "string.min": "Name must be at least 1 character long",
      "string.max": "Name must not exceed 255 characters",
    }),
    transactionDate: Joi.date().optional().messages({
      "date.base": "Transaction date must be a valid date",
    }),
    isActive: Joi.boolean().optional().default(true),
  }),

  update: Joi.object({
    transactionId: Joi.string().optional(),
    type: Joi.string()
      .valid(...types)
      .optional()
      .messages({
        "any.only": `Type must be one of the following: ${types.join(", ")}`,
      }),
    name: Joi.string().trim().min(1).max(255).optional().messages({
      "string.min": "Name must be at least 1 character long",
      "string.max": "Name must not exceed 255 characters",
    }),
    transactionDate: Joi.date().optional().messages({
      "date.base": "Transaction date must be a valid date",
    }),
    isActive: Joi.boolean().optional(),
  }),

  // Query validation schemas for GET APIs
  query: {
    getAll: Joi.object({
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
          "number.max": "Limit cannot exceed 100",
        }),
      search: Joi.string()
        .trim()
        .optional()
        .allow(null, "")
        .default("")
        .messages({
          "string.base": "Search must be a string",
        }),
      sortBy: Joi.string()
        .valid(
          "id",
          "transactionId",
          "type",
          "name",
          "transactionDate",
          "isActive",
          "createdAt",
          "updatedAt"
        )
        .optional()
        .default("createdAt")
        .messages({
          "any.only":
            "SortBy must be one of: id, transactionId, type, name, transactionDate, isActive, createdAt, updatedAt",
        }),
      order: Joi.string()
        .valid("asc", "desc")
        .optional()
        .default("desc")
        .messages({
          "any.only": "Order must be either 'asc' or 'desc'",
        }),
      type: Joi.string()
        .valid(...types, "")
        .optional()
        .default("")
        .messages({
          "any.only": `Type must be one of the following: ${types.join(
            ", "
          )} or empty`,
        }),
      isActive: Joi.string()
        .valid("true", "false", "")
        .optional()
        .default("")
        .messages({
          "any.only": "isActive must be 'true', 'false', or empty",
        }),
    }),

    getByType: Joi.object({
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
          "number.max": "Limit cannot exceed 100",
        }),
      search: Joi.string().trim().optional().default("").messages({
        "string.base": "Search must be a string",
      }),
      sortBy: Joi.string()
        .valid(
          "id",
          "transactionId",
          "type",
          "name",
          "transactionDate",
          "isActive",
          "createdAt",
          "updatedAt"
        )
        .optional()
        .default("createdAt")
        .messages({
          "any.only":
            "SortBy must be one of: id, transactionId, type, name, transactionDate, isActive, createdAt, updatedAt",
        }),
      order: Joi.string()
        .valid("asc", "desc")
        .optional()
        .default("desc")
        .messages({
          "any.only": "Order must be either 'asc' or 'desc'",
        }),
    }),
  },
};

export default assetTransactionSchema;
