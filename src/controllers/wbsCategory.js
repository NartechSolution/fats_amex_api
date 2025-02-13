import { wbsCategorySchema } from "../schemas/wbsCategory.schema.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class WbsCategoryController {
  static async create(req, res, next) {
    let imagePath;
    try {
      const { error, value } = wbsCategorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      if (req.file) {
        imagePath = addDomain(req.file.path);
        value.image = imagePath;
      }

      const category = await prisma.wbsCategory.create({
        data: value,
      });

      res
        .status(201)
        .json(response(201, true, "Category created successfully", category));
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
            OR: [{ name: { contains: search } }],
          }
        : {};

      // Get total count
      const total = await prisma.wbsCategory.count({
        where: searchCondition,
      });

      // Get categories with pagination
      const categories = await prisma.wbsCategory.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Categories retrieved successfully", {
          categories,
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

      const category = await prisma.wbsCategory.findUnique({
        where: { id },
        include: {
          inventories: true,
        },
      });

      if (!category) {
        throw new MyError("Category not found", 404);
      }

      res
        .status(200)
        .json(response(200, true, "Category retrieved successfully", category));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = wbsCategorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if category exists
      const existingCategory = await prisma.wbsCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new MyError("Category not found", 404);
      }

      // Handle image upload
      if (req.file) {
        const imagePath = addDomain(req.file.path);
        value.image = imagePath;
        if (existingCategory.image) {
          await deleteFile(existingCategory.image);
        }
      }

      const category = await prisma.wbsCategory.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(response(200, true, "Category updated successfully", category));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const category = await prisma.wbsCategory.findUnique({
        where: { id },
      });

      if (!category) {
        throw new MyError("Category not found", 404);
      }

      // Delete associated image if exists
      if (category.image) {
        await deleteFile(category.image);
      }

      await prisma.wbsCategory.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Category deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Category not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default WbsCategoryController;
