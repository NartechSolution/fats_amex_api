import Joi from "joi";

export const fatsCategorySchema = Joi.object({
  mainCatCode: Joi.string().required(),
  mainCategoryDesc: Joi.string().required(),
  mainDescription: Joi.string().required(),
  subCategoryCode: Joi.string().required(),
  subCategoryDesc: Joi.string().required(),
});
