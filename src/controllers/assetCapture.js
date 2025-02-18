import { assetCaptureSchema } from "../schemas/assetCapture.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class AssetCaptureController {
  static async create(req, res, next) {
    try {
      const { error, value } = assetCaptureSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }
      const capture = await prisma.assetCapture.create({
        data: value,
      });
      res
        .status(201)
        .json(
          response(201, true, "Asset Capture created successfully", capture)
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
      const searchCondition = search
        ? {
            OR: [
              { assetDescription: { contains: search } },
              { serialNumber: { contains: search } },
              { assetTag: { contains: search } },
            ],
          }
        : {};
      const total = await prisma.assetCapture.count({ where: searchCondition });
      const captures = await prisma.assetCapture.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
        include: {
          location: true,
          fatsCategory: true,
        },
      });
      const totalPages = Math.ceil(total / limit);
      res.status(200).json(
        response(200, true, "Asset Captures retrieved successfully", {
          captures,
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
      const capture = await prisma.assetCapture.findUnique({
        where: { id },
        include: {
          location: true,
          fatsCategory: true,
        },
      });
      if (!capture) {
        throw new MyError("Asset Capture not found", 404);
      }
      res
        .status(200)
        .json(
          response(200, true, "Asset Capture retrieved successfully", capture)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = assetCaptureSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }
      const existingCapture = await prisma.assetCapture.findUnique({
        where: { id },
      });
      if (!existingCapture) {
        throw new MyError("Asset Capture not found", 404);
      }
      const updatedCapture = await prisma.assetCapture.update({
        where: { id },
        data: value,
      });
      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset Capture updated successfully",
            updatedCapture
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const existingCapture = await prisma.assetCapture.findUnique({
        where: { id },
      });
      if (!existingCapture) {
        throw new MyError("Asset Capture not found", 404);
      }
      await prisma.assetCapture.delete({ where: { id } });
      res
        .status(200)
        .json(response(200, true, "Asset Capture deleted successfully", null));
    } catch (error) {
      next(error);
    }
  }

  static async getGenerated(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        order = "desc",
      } = req.query;
      const skip = (page - 1) * limit;
      const searchCondition = search
        ? {
            OR: [
              { assetDescription: { contains: search } },
              { serialNumber: { contains: search } },
              { assetTag: { contains: search } },
            ],
          }
        : {};
      const condition = { ...searchCondition, isGenerated: true };
      const total = await prisma.assetCapture.count({ where: condition });
      const captures = await prisma.assetCapture.findMany({
        where: condition,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
        include: {
          location: true,
          fatsCategory: true,
        },
      });
      const totalPages = Math.ceil(total / limit);
      res.status(200).json(
        response(200, true, "Generated Asset Captures retrieved successfully", {
          captures,
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

  static async getNotGenerated(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        order = "desc",
      } = req.query;
      const skip = (page - 1) * limit;
      const searchCondition = search
        ? {
            OR: [
              { assetDescription: { contains: search } },
              { serialNumber: { contains: search } },
              { assetTag: { contains: search } },
            ],
          }
        : {};
      const condition = { ...searchCondition, isGenerated: false };
      const total = await prisma.assetCapture.count({ where: condition });
      const captures = await prisma.assetCapture.findMany({
        where: condition,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
        include: {
          location: true,
          fatsCategory: true,
        },
      });
      const totalPages = Math.ceil(total / limit);
      res.status(200).json(
        response(
          200,
          true,
          "Not Generated Asset Captures retrieved successfully",
          {
            captures,
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

export default AssetCaptureController;
