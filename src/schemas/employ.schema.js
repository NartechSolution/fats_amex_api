import Joi from "joi";

const employSchema = {
  create: Joi.object({
    employeeId: Joi.string().required(),
    name: Joi.string().required(),
  }),
  update: Joi.object({
    employeeId: Joi.string(),
    name: Joi.string(),
  }).min(1), // At least one field must be provided for update
};

export default employSchema;
