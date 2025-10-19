import {
  inventoryItemsSchema,
  inventoryQuerySchema,
  inventoryTransactionSchema,
  verifiedAssetsByInventoryQuerySchema,
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

      if (!value.createdBy && req.user) {
        value.createdBy = req.user.username;
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

  static async getAll(req, res, next) {
    try {
      const { error, value } = inventoryQuerySchema.validate(req.query);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const { page, limit, search, sortBy, order, status, createdBy } = value;
      const skip = (page - 1) * limit;

      // Build search conditions
      let searchCondition = {};

      if (search) {
        searchCondition.OR = [
          { transactionId: { contains: search } },
          { transactionName: { contains: search } },
          { createdBy: { contains: search } },
          { scanningMode: { contains: search } },
        ];
      }

      // Add status filter
      if (status) {
        searchCondition.status = status;
      }

      // Add createdBy filter
      if (createdBy) {
        searchCondition.createdBy = createdBy;
      }

      // Get total count
      const total = await prisma.inventory.count({
        where: searchCondition,
      });

      // Get inventories with pagination
      const inventories = await prisma.inventory.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        // include: {
        //   verifiedAssets: {
        //     select: {
        //       id: true,
        //       tagNumber: true,
        //       serialNumber: true,
        //       assetDescription: true,
        //     },
        //   },
        // },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Inventories retrieved successfully", {
          inventories,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages,
            hasMore: page < totalPages,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getVerifiedAssetsByInventoryId(req, res, next) {
    try {
      const { id } = req.params;

      // Validate query parameters
      const { error, value } = verifiedAssetsByInventoryQuerySchema.validate(
        req.query
      );
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const { page, limit, search, sortBy, order } = value;
      const skip = (page - 1) * limit;

      // Check if inventory exists
      const inventory = await prisma.inventory.findUnique({
        where: { id },
      });

      if (!inventory) {
        throw new MyError("Inventory transaction not found", 404);
      }

      // Build search conditions
      let searchCondition = {
        inventoryId: id,
      };

      if (search) {
        searchCondition.OR = [
          { majorCategory: { contains: search } },
          { majorCategoryDescription: { contains: search } },
          { minorCategory: { contains: search } },
          { minorCategoryDescription: { contains: search } },
          { tagNumber: { contains: search } },
          { serialNumber: { contains: search } },
          { assetDescription: { contains: search } },
          { assetType: { contains: search } },
          { assetCondition: { contains: search } },
          { employeeId: { contains: search } },
        ];
      }

      // Get total count
      const total = await prisma.verifiedAsset.count({
        where: searchCondition,
      });

      // Get verified assets with pagination
      const verifiedAssets = await prisma.verifiedAsset.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Verified assets retrieved successfully", {
          inventory: {
            id: inventory.id,
            transactionId: inventory.transactionId,
            transactionName: inventory.transactionName,
            transactionDate: inventory.transactionDate,
            status: inventory.status,
            createdBy: inventory.createdBy,
          },
          verifiedAssets,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages,
            hasMore: page < totalPages,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default InventoryController;
