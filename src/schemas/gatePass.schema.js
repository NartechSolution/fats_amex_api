import Joi from "joi";

export const gatePassSchema = Joi.object({
  gatePassNo: Joi.string().optional(),
  gatePassType: Joi.string().optional(),
  gatePassDate: Joi.date().optional(),
  returnable: Joi.boolean().optional(),
  sourceSite: Joi.string().optional(),
  destinationSite: Joi.string().optional(),
  sender: Joi.string().optional(),
  receiver: Joi.string().optional(),
  driverName: Joi.string().optional(),
  vehicleNo: Joi.string().optional(),
  vehicleCompany: Joi.string().optional(),
  preparedBy: Joi.string().optional(),
  hodName: Joi.string().optional(),
  hodStatus: Joi.string().optional(),
  hodDate: Joi.date().optional(),
  authorizedBy: Joi.string().optional(),
  authorizedStatus: Joi.string().required(),
  authorizedDate: Joi.date().optional(),
  remarks: Joi.string().optional(),
  qrcode: Joi.string().optional(),
  details: Joi.array()
    .items(
      Joi.object({
        srNo: Joi.number().integer().optional(),
        itemCode: Joi.string().optional(),
        description: Joi.string().optional(),
        uom: Joi.string().optional(),
        quantity: Joi.number().optional(),
        remarks: Joi.string().optional(),
      })
    )
    .optional(),
});

export const gatePassDetailSchema = Joi.object({
  srNo: Joi.number().integer().optional(),
  itemCode: Joi.string().optional(),
  description: Joi.string().optional(),
  uom: Joi.string().optional(),
  quantity: Joi.number().optional(),
  remarks: Joi.string().optional(),
  gatePassId: Joi.string().required(),
});

export const gatePassUpdateSchema = Joi.object({
  gatePassNo: Joi.string().optional(),
  gatePassType: Joi.string().optional(),
  gatePassDate: Joi.date().optional(),
  returnable: Joi.boolean().optional(),
  sourceSite: Joi.string().optional(),
  destinationSite: Joi.string().optional(),
  sender: Joi.string().optional(),
  receiver: Joi.string().optional(),
  driverName: Joi.string().optional(),
  vehicleNo: Joi.string().optional(),
  vehicleCompany: Joi.string().optional(),
  preparedBy: Joi.string().optional(),
  hodName: Joi.string().optional(),
  hodStatus: Joi.string().optional(),
  hodDate: Joi.date().optional(),
  authorizedBy: Joi.string().optional(),
  authorizedStatus: Joi.string().optional(),
  authorizedDate: Joi.date().optional(),
  remarks: Joi.string().optional(),
  qrcode: Joi.string().optional(),
  details: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().optional(),
        srNo: Joi.number().integer().optional(),
        itemCode: Joi.string().optional(),
        description: Joi.string().optional(),
        uom: Joi.string().optional(),
        quantity: Joi.number().optional(),
        remarks: Joi.string().optional(),
      })
    )
    .optional(),
});
