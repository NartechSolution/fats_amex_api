import Joi from "joi";

export const wbsInventorySchema = Joi.object({
  name: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  price: Joi.number().required().min(0),
  quantity: Joi.number().integer().required().min(0),
  batchNumber: Joi.string().allow(null, ""),
  serialNumber: Joi.string().allow(null, ""),
  assetLocation: Joi.string().allow(null, ""),
  expiryDate: Joi.date().allow(null),
  manufactureDate: Joi.date().allow(null),
  image: Joi.string().allow(null, ""),
  categoryId: Joi.string().required(),
  modifiers: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()),
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          return helpers.error("any.invalid");
        } catch (err) {
          return helpers.error("any.invalid");
        }
      })
    )
    .default([]),
});
