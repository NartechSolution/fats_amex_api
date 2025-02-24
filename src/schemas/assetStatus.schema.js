import Joi from "joi";

const assetStatusSchema = {
  create: Joi.object({
    status: Joi.string().required(),
  }),
  update: Joi.object({
    status: Joi.string().required(),
  }),
};

export default assetStatusSchema;
