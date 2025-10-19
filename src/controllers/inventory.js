import {
  inventoryItemsSchema,
  inventoryTransactionSchema,
} from "../schemas/inventory.schema.js";
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

  static async addVerifiedAssets(req, res, next) {
    try {
      const { error, value } = inventoryItemsSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const { inventoryId, verifiedAssetsId } = value;

      // Check if inventory exists
      const inventory = await prisma.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!inventory) {
        throw new MyError("Inventory transaction not found", 404);
      }

      // Verify all verified assets exist
      const verifiedAssets = await prisma.verifiedAsset.findMany({
        where: {
          id: {
            in: verifiedAssetsId,
          },
        },
      });

      if (verifiedAssets.length !== verifiedAssetsId.length) {
        throw new MyError("One or more verified assets not found", 404);
      }

      // Update verified assets to link them to the inventory
      await prisma.verifiedAsset.updateMany({
        where: {
          id: {
            in: verifiedAssetsId,
          },
        },
        data: {
          inventoryId: inventoryId,
        },
      });

      // Fetch updated inventory with verified assets
      const updatedInventory = await prisma.inventory.findUnique({
        where: { id: inventoryId },
        include: {
          verifiedAssets: true,
        },
      });

      res
        .status(200)
        .json(
          response(
            200,
            true,
            `Successfully added ${verifiedAssetsId.length} verified assets to inventory`,
            updatedInventory
          )
        );
    } catch (error) {
      next(error);
    }
  }
}

export default InventoryController;
