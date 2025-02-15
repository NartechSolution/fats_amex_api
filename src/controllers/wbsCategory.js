import { wbsCategorySchema } from "../schemas/wbsCategory.schema.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";
import ExcelJS from "exceljs";

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

  static async exportExcel(req, res, next) {
    try {
      console.log("[Excel Export] Starting category export process");

      // Fetch all categories with their related inventories
      const categories = await prisma.wbsCategory.findMany({
        include: {
          inventories: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (categories.length === 0) {
        throw new MyError("No categories found for export", 404);
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Categories");

      // Define columns
      worksheet.columns = [
        { header: "Name", key: "name", width: 30 },
        { header: "Image URL", key: "image", width: 50 },
        { header: "Number of Inventories", key: "inventoryCount", width: 20 },
        { header: "Created At", key: "createdAt", width: 20 },
        { header: "Updated At", key: "updatedAt", width: 20 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add category data
      categories.forEach((category) => {
        try {
          const rowData = {
            name: category?.name || "",
            image: category?.image || "",
            inventoryCount: category?.inventories?.length || 0,
            createdAt: category?.createdAt
              ? new Date(category.createdAt).toLocaleDateString()
              : "",
            updatedAt: category?.updatedAt
              ? new Date(category.updatedAt).toLocaleDateString()
              : "",
          };

          const row = worksheet.addRow(rowData);

          // Add borders to cells
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        } catch (err) {
          console.error(
            `Error adding row for category ${category?.id || "unknown"}:`,
            err
          );
        }
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        if (column.key) {
          try {
            const values = worksheet.getColumn(column.key).values;
            const maxLength = values
              ? Math.max(
                  ...values
                    .map((v) => (v ? String(v).length : 0))
                    .filter(Boolean)
                )
              : 10;
            column.width = Math.min(Math.max(maxLength, 10), 50);
          } catch (err) {
            console.error(`Error auto-fitting column ${column.key}:`, err);
            column.width = 15;
          }
        }
      });

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="categories.xlsx"'
      );

      console.log("[Excel Export] Writing workbook to response");

      // Write to response
      await workbook.xlsx.write(res);

      console.log("[Excel Export] Export completed successfully");

      res.end();
    } catch (error) {
      console.error("[Excel Export Error]", error);
      next(error);
    }
  }
}

export default WbsCategoryController;
