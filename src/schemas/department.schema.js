import Joi from "joi";

const departmentSchema = {
  create: Joi.object({
    name: Joi.string().required(),
  }),
  update: Joi.object({
    name: Joi.string().required(),
  }),
};

export default departmentSchema;
