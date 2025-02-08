import Joi from "joi";

const roles = ["fats", "wbs", "admin"];

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

export const userSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  name: Joi.string().optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  role: Joi.string()
    .valid(...roles)
    .optional(),
});
