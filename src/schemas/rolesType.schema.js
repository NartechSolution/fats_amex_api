import Joi from "joi";

const rolesTypeSchema = {
  create: Joi.object({
    name: Joi.string().required(),
  }),
  update: Joi.object({
    name: Joi.string().required(),
  }),
};

export default rolesTypeSchema;
