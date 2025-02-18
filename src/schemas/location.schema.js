import Joi from "joi";

export const locationSchema = Joi.object({
  company: Joi.string().optional(),
  building: Joi.string().optional(),
  levelFloor: Joi.string().optional(),
  office: Joi.string().optional(),
  room: Joi.string().optional(),
  locationCode: Joi.string().optional(),
}).min(1);
