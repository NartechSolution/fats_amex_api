import prisma from "../utils/prismaClient.js";
import assetStatusSchema from "../schemas/assetStatus.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";

class AssetStatusController {
  static async create(req, res, next) {
    try {
      const { error, value } = assetStatusSchema.create.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const assetStatus = await prisma.assetStatus.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(201, true, "Asset status created successfully", assetStatus)
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
            OR: [{ status: { contains: search } }],
          }
        : {};

      // Get total count
      const total = await prisma.assetStatus.count({
        where: searchCondition,
      });

      // Get asset statuses with pagination
      const assetStatuses = await prisma.assetStatus.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Asset statuses retrieved successfully", {
          assetStatuses,
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

      const assetStatus = await prisma.assetStatus.findUnique({
        where: { id },
      });

      if (!assetStatus) {
        throw new MyError("Asset status not found", 404);
      }

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset status retrieved successfully",
            assetStatus
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = assetStatusSchema.update.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingAssetStatus = await prisma.assetStatus.findUnique({
        where: { id },
      });

      if (!existingAssetStatus) {
        throw new MyError("Asset status not found", 404);
      }

      const assetStatus = await prisma.assetStatus.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(
          response(200, true, "Asset status updated successfully", assetStatus)
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const assetStatus = await prisma.assetStatus.findUnique({
        where: { id },
      });

      if (!assetStatus) {
        throw new MyError("Asset status not found", 404);
      }

      await prisma.assetStatus.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Asset status deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Asset status not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default AssetStatusController;
