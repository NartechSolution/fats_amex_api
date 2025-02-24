import prisma from "../utils/prismaClient.js";
import assetConditionSchema from "../schemas/assetCondition.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";

class AssetConditionController {
  static async create(req, res, next) {
    try {
      const { error, value } = assetConditionSchema.create.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const assetCondition = await prisma.assetCondition.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(
            201,
            true,
            "Asset condition created successfully",
            assetCondition
          )
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
            OR: [{ condition: { contains: search } }],
          }
        : {};

      // Get total count
      const total = await prisma.assetCondition.count({
        where: searchCondition,
      });

      // Get asset conditions with pagination
      const assetConditions = await prisma.assetCondition.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Asset conditions retrieved successfully", {
          assetConditions,
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

      const assetCondition = await prisma.assetCondition.findUnique({
        where: { id },
      });

      if (!assetCondition) {
        throw new MyError("Asset condition not found", 404);
      }

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset condition retrieved successfully",
            assetCondition
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = assetConditionSchema.update.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingAssetCondition = await prisma.assetCondition.findUnique({
        where: { id },
      });

      if (!existingAssetCondition) {
        throw new MyError("Asset condition not found", 404);
      }

      const assetCondition = await prisma.assetCondition.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset condition updated successfully",
            assetCondition
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const assetCondition = await prisma.assetCondition.findUnique({
        where: { id },
      });

      if (!assetCondition) {
        throw new MyError("Asset condition not found", 404);
      }

      await prisma.assetCondition.delete({
        where: { id },
      });

      res
        .status(200)
        .json(
          response(200, true, "Asset condition deleted successfully", null)
        );
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Asset condition not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default AssetConditionController;
