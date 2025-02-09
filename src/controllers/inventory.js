import { inventorySchema } from "../schemas/inventory.schema.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class InventoryController {
  static async create(req, res, next) {
    let imagePath;
    try {
      const { error, value } = inventorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      if (req.file) {
        imagePath = addDomain(req.file.path);
        value.image = imagePath;
      }

      const inventory = await prisma.inventory.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(201, true, "Inventory item created successfully", inventory)
        );
    } catch (error) {
      if (imagePath) {
        await deleteFile(imagePath);
      }
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        order = "desc",
      } = req.query;

      const skip = (page - 1) * limit;

      // Build search conditions
      const searchCondition = search
        ? {
            OR: [
              { assetLocation: { contains: search } },
              { mainCatDesc: { contains: search } },
              { mainDesc: { contains: search } },
              { serial: { contains: search } },
              { employeeId: { contains: search } },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.inventory.count({
        where: searchCondition,
      });

      // Get inventory items with pagination
      const items = await prisma.inventory.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Inventory items retrieved successfully", {
          items,
          pagination: {
            total,
            page: Number(page),
            totalPages,
            hasMore: page < totalPages,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const item = await prisma.inventory.findUnique({
        where: { id },
      });

      if (!item) {
        throw new MyError("Inventory item not found", 404);
      }

      res
        .status(200)
        .json(
          response(200, true, "Inventory item retrieved successfully", item)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = inventorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const inventory = await prisma.inventory.findUnique({
        where: { id },
      });

      if (!inventory) {
        throw new MyError("Inventory item not found", 404);
      }

      if (req.file) {
        value.image = req.file.path;
        if (inventory.image) {
          await deleteFile(inventory.image);
        }
      }

      const item = await prisma.inventory.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(response(200, true, "Inventory item updated successfully", item));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Inventory item not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const inventory = await prisma.inventory.findUnique({
        where: { id },
      });

      if (!inventory) {
        throw new MyError("Inventory item not found", 404);
      }

      if (inventory.image) {
        await deleteFile(inventory.image);
      }

      await prisma.inventory.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Inventory item deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Inventory item not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default InventoryController;
