import { assetCapturePDASchema } from "../schemas/assetCapturePDA.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class AssetCapturePDAController {
  static async create(req, res, next) {
    try {
      // Check if the request body is an array (bulk creation) or single object
      const isArray = Array.isArray(req.body);
      const dataToValidate = isArray ? req.body : [req.body];

      // Validate each object in the array
      const validatedData = [];
      for (const item of dataToValidate) {
        const { error, value } = assetCapturePDASchema.validate(item);
        if (error) {
          throw new MyError(
            `Validation error: ${error.details[0].message}`,
            400
          );
        }
        validatedData.push(value);
      }

      // Create records (bulk or single)
      const captures = [];
      for (const data of validatedData) {
        const capture = await prisma.assetCapturePDA.create({
          data: data,
          include: {
            location: true,
            fatsCategory: true,
          },
        });
        captures.push(capture);
      }

      res
        .status(201)
        .json(
          response(
            201,
            true,
            `${captures.length} Asset Capture PDA record(s) created successfully`,
            isArray ? captures : captures[0]
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
      const searchCondition = search
        ? {
            OR: [
              { assetDescription: { contains: search } },
              { serialNumber: { contains: search } },
              { assetTag: { contains: search } },
              { brand: { contains: search } },
              { modal: { contains: search } },
            ],
          }
        : {};

      const total = await prisma.assetCapturePDA.count({
        where: searchCondition,
      });
      const captures = await prisma.assetCapturePDA.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
        include: {
          location: true,
          fatsCategory: true,
        },
      });

      res.json(
        response(200, true, "Asset Captures PDA retrieved successfully", {
          data: captures,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit),
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
      const capture = await prisma.assetCapturePDA.findUnique({
        where: { id },
        include: {
          location: true,
          fatsCategory: true,
        },
      });

      if (!capture) {
        throw new MyError("Asset Capture PDA not found", 404);
      }

      res.json(
        response(200, true, "Asset Capture PDA retrieved successfully", capture)
      );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = assetCapturePDASchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const capture = await prisma.assetCapturePDA.update({
        where: { id },
        data: value,
        include: {
          location: true,
          fatsCategory: true,
        },
      });

      res.json(
        response(200, true, "Asset Capture PDA updated successfully", capture)
      );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await prisma.assetCapturePDA.delete({
        where: { id },
      });

      res.json(
        response(200, true, "Asset Capture PDA deleted successfully", null)
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AssetCapturePDAController;
