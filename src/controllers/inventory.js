import { inventoryTransactionSchema } from "../schemas/inventory.schema.js";
import MyError from "../utils/error.js";
import { generateTransactionId } from "../utils/generateUniqueId.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class InventoryController {
  static async create(req, res, next) {
    try {
      const { error, value } = inventoryTransactionSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Generate transaction ID if not provided
      if (!value.transactionId) {
        value.transactionId = generateTransactionId();
      }

      // Set transaction date to now if not provided
      if (!value.transactionDate) {
        value.transactionDate = new Date();
      }

      // Set createdBy from authenticated user if not provided
      if (!value.createdBy && req.user) {
        value.createdBy = req.user.id;
      }

      const inventory = await prisma.inventory.create({
        data: value,
        include: {
          verifiedAssets: true,
        },
      });

      res
        .status(201)
        .json(
          response(
            201,
            true,
            "Inventory transaction created successfully",
            inventory
          )
        );
    } catch (error) {
      next(error);
    }
  }
}

export default InventoryController;
