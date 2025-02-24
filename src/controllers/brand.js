import prisma from "../utils/prismaClient.js";
import brandSchema from "../schemas/brand.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";

class BrandController {
  static async create(req, res, next) {
    try {
      const { error, value } = brandSchema.create.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const brand = await prisma.brand.create({
        data: value,
      });

      res
        .status(201)
        .json(response(201, true, "Brand created successfully", brand));
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
      const total = await prisma.brand.count({
        where: searchCondition,
      });

      // Get brands with pagination
      const brands = await prisma.brand.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Brands retrieved successfully", {
          brands,
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

      const brand = await prisma.brand.findUnique({
        where: { id },
      });

      if (!brand) {
        throw new MyError("Brand not found", 404);
      }

      res
        .status(200)
        .json(response(200, true, "Brand retrieved successfully", brand));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = brandSchema.update.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingBrand = await prisma.brand.findUnique({
        where: { id },
      });

      if (!existingBrand) {
        throw new MyError("Brand not found", 404);
      }

      const brand = await prisma.brand.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(response(200, true, "Brand updated successfully", brand));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const brand = await prisma.brand.findUnique({
        where: { id },
      });

      if (!brand) {
        throw new MyError("Brand not found", 404);
      }

      await prisma.brand.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Brand deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Brand not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default BrandController;
