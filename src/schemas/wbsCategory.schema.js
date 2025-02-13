import Joi from "joi";

export const wbsCategorySchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().allow(null, ""),
});
