import Joi from "joi";

const brandSchema = {
  create: Joi.object({
    name: Joi.string().required(),
  }),
  update: Joi.object({
    name: Joi.string().required(),
  }),
};

export default brandSchema;
