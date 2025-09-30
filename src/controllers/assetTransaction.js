import assetTransactionSchema from "../schemas/assetTransaction.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class AssetTransactionController {
  static async create(req, res, next) {
    try {
      const { error, value } = assetTransactionSchema.create.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const assetTransaction = await prisma.assetTransaction.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(
            201,
            true,
            "Asset transaction created successfully",
            assetTransaction
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      // Validate query parameters
      const { error, value } = assetTransactionSchema.query.getAll.validate(
        req.query
      );
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const { page, limit, search, sortBy, order, type, isActive } = value;

      const skip = (page - 1) * limit;

      // Build search conditions
      const searchCondition = {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { type: { contains: search } },
                  { transactionId: { contains: search } },
                ],
              }
            : {},
          type ? { type: { equals: type } } : {},
          isActive !== "" ? { isActive: isActive === "true" } : {},
        ],
      };

      // Remove empty objects from AND array
      searchCondition.AND = searchCondition.AND.filter(
        (condition) => Object.keys(condition).length > 0
      );

      // If no conditions, use empty object
      const whereClause = searchCondition.AND.length > 0 ? searchCondition : {};

      // Get total count
      const total = await prisma.assetTransaction.count({
        where: whereClause,
      });

      // Get asset transactions with pagination
      const assetTransactions = await prisma.assetTransaction.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Asset transactions retrieved successfully", {
          assetTransactions,
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

      const assetTransaction = await prisma.assetTransaction.findUnique({
        where: { id },
      });

      if (!assetTransaction) {
        throw new MyError("Asset transaction not found", 404);
      }

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset transaction retrieved successfully",
            assetTransaction
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = assetTransactionSchema.update.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingAssetTransaction = await prisma.assetTransaction.findUnique(
        {
          where: { id },
        }
      );

      if (!existingAssetTransaction) {
        throw new MyError("Asset transaction not found", 404);
      }

      const assetTransaction = await prisma.assetTransaction.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset transaction updated successfully",
            assetTransaction
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const assetTransaction = await prisma.assetTransaction.findUnique({
        where: { id },
      });

      if (!assetTransaction) {
        throw new MyError("Asset transaction not found", 404);
      }

      await prisma.assetTransaction.delete({
        where: { id },
      });

      res
        .status(200)
        .json(
          response(200, true, "Asset transaction deleted successfully", null)
        );
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Asset transaction not found", 404));
      } else {
        next(error);
      }
    }
  }

  // Additional method to get transactions by type
  static async getByType(req, res, next) {
    try {
      const { type } = req.params;

      // Validate query parameters
      const { error, value } = assetTransactionSchema.query.getByType.validate(
        req.query
      );
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const { page, limit, search, sortBy, order } = value;

      // Validate transaction type using enums
      const { ASSET_TRANSACTION_TYPES } = await import("../constants/enums.js");
      const validTypes = Object.values(ASSET_TRANSACTION_TYPES);
      if (!validTypes.includes(type)) {
        throw new MyError(
          `Invalid transaction type. Must be one of the following: ${validTypes.join(
            ", "
          )}`,
          400
        );
      }

      const skip = (page - 1) * limit;

      // Build search conditions
      const searchCondition = {
        AND: [
          { type: { equals: type } },
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { transactionId: { contains: search } },
                ],
              }
            : {},
        ],
      };

      // Remove empty objects from AND array
      searchCondition.AND = searchCondition.AND.filter(
        (condition) => Object.keys(condition).length > 0
      );

      // Get total count
      const total = await prisma.assetTransaction.count({
        where: searchCondition,
      });

      // Get asset transactions with pagination
      const assetTransactions = await prisma.assetTransaction.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(
          200,
          true,
          `Asset transactions of type '${type}' retrieved successfully`,
          {
            assetTransactions,
            pagination: {
              total,
              page: Number(page),
              totalPages,
              hasMore: page < totalPages,
            },
          }
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AssetTransactionController;
