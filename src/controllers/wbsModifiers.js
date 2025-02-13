import { wbsModifierSchema } from "../schemas/wbsModifier.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class WbsModifierController {
  static async create(req, res, next) {
    try {
      const { error, value } = wbsModifierSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const modifier = await prisma.wbsModifier.create({
        data: value,
      });

      res
        .status(201)
        .json(response(201, true, "Modifier created successfully", modifier));
    } catch (error) {
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
        isActive,
      } = req.query;

      const skip = (page - 1) * limit;

      // Build search conditions
      let searchCondition = search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {};

      // Add isActive filter if provided
      if (isActive !== undefined) {
        searchCondition = {
          ...searchCondition,
          isActive: isActive === "true",
        };
      }

      // Get total count
      const total = await prisma.wbsModifier.count({
        where: searchCondition,
      });

      // Get modifiers with pagination
      const modifiers = await prisma.wbsModifier.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Modifiers retrieved successfully", {
          modifiers,
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

      const modifier = await prisma.wbsModifier.findUnique({
        where: { id },
        include: {
          inventories: true,
        },
      });

      if (!modifier) {
        throw new MyError("Modifier not found", 404);
      }

      res
        .status(200)
        .json(response(200, true, "Modifier retrieved successfully", modifier));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = wbsModifierSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if modifier exists
      const existingModifier = await prisma.wbsModifier.findUnique({
        where: { id },
      });

      if (!existingModifier) {
        throw new MyError("Modifier not found", 404);
      }

      const modifier = await prisma.wbsModifier.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(response(200, true, "Modifier updated successfully", modifier));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.wbsModifier.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Modifier deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Modifier not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default WbsModifierController;
