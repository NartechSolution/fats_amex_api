import Joi from "joi";

const assetConditionSchema = {
  create: Joi.object({
    condition: Joi.string().required(),
  }),
  update: Joi.object({
    condition: Joi.string().required(),
  }),
};

export default assetConditionSchema;
