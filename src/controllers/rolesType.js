import prisma from "../utils/prismaClient.js";
import rolesTypeSchema from "../schemas/rolesType.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";

class RolesTypeController {
  static async create(req, res, next) {
    try {
      const { error, value } = rolesTypeSchema.create.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const rolesType = await prisma.rolesType.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(201, true, "Roles type created successfully", rolesType)
        );
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
      } = req.query;

      const skip = (page - 1) * limit;

      // Build search conditions
      const searchCondition = search
        ? {
            OR: [{ name: { contains: search } }],
          }
        : {};

      // Get total count
      const total = await prisma.rolesType.count({
        where: searchCondition,
      });

      // Get roles types with pagination
      const rolesTypes = await prisma.rolesType.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Roles types retrieved successfully", {
          rolesTypes,
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

      const rolesType = await prisma.rolesType.findUnique({
        where: { id },
      });

      if (!rolesType) {
        throw new MyError("Roles type not found", 404);
      }

      res
        .status(200)
        .json(
          response(200, true, "Roles type retrieved successfully", rolesType)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = rolesTypeSchema.update.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingRolesType = await prisma.rolesType.findUnique({
        where: { id },
      });

      if (!existingRolesType) {
        throw new MyError("Roles type not found", 404);
      }

      const rolesType = await prisma.rolesType.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(
          response(200, true, "Roles type updated successfully", rolesType)
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const rolesType = await prisma.rolesType.findUnique({
        where: { id },
      });

      if (!rolesType) {
        throw new MyError("Roles type not found", 404);
      }

      await prisma.rolesType.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Roles type deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Roles type not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default RolesTypeController;
