import { fatsCategorySchema } from "../schemas/fatsCategory.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";
import ExcelJS from "exceljs";

class FatsCategoryController {
  static async create(req, res, next) {
    try {
      const { error, value } = fatsCategorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if category with same mainCatCode exists
      const existingCategory = await prisma.fatsCategory.findFirst({
        where: { subCategoryCode: value.subCategoryCode },
      });

      if (existingCategory) {
        throw new MyError("Category with subCategoryCode already exists", 409);
      }

      const category = await prisma.fatsCategory.create({
        data: value,
      });

      res
        .status(201)
        .json(response(201, true, "Category created successfully", category));
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
            OR: [
              { mainCatCode: { contains: search } },
              { mainCategoryDesc: { contains: search } },
              { mainDescription: { contains: search } },
              { subCategoryCode: { contains: search } },
              { subCategoryDesc: { contains: search } },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.fatsCategory.count({
        where: searchCondition,
      });

      // Get categories with pagination
      const categories = await prisma.fatsCategory.findMany({
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

      const category = await prisma.fatsCategory.findUnique({
        where: { id },
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
      const { error, value } = fatsCategorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if category exists
      const existingCategory = await prisma.fatsCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new MyError("Category not found", 404);
      }

      // Check if new mainCatCode conflicts with existing ones
      if (value.mainCatCode !== existingCategory.mainCatCode) {
        const conflictingCategory = await prisma.fatsCategory.findFirst({
          where: { mainCatCode: value.mainCatCode },
        });

        if (conflictingCategory) {
          throw new MyError("Category with this code already exists", 409);
        }
      }

      const category = await prisma.fatsCategory.update({
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

      await prisma.fatsCategory.delete({
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

  static async bulkCreate(req, res, next) {
    try {
      const categories = req.body;

      if (!Array.isArray(categories)) {
        throw new MyError("Request body must be an array of categories", 400);
      }

      // Validate each category
      const validatedCategories = [];
      for (const category of categories) {
        const { error, value } = fatsCategorySchema.validate(category);
        if (error) {
          throw new MyError(
            `Validation error: ${error.details[0].message}`,
            400
          );
        }
        validatedCategories.push(value);
      }

      // Bulk create categories without any duplicate checks
      const createdCategories = await prisma.fatsCategory.createMany({
        data: validatedCategories,
      });

      res.status(201).json(
        response(201, true, "Categories created successfully", {
          count: createdCategories.count,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async exportExcel(req, res, next) {
    try {
      console.log("[Excel Export] Starting FATS categories export process");

      const { search = "" } = req.query;
      console.log("[Excel Export] Search query:", search);

      // Build search conditions - same as in getAll method
      const searchCondition = search
        ? {
            OR: [
              { mainCatCode: { contains: search } },
              { mainCategoryDesc: { contains: search } },
              { mainDescription: { contains: search } },
              { subCategoryCode: { contains: search } },
              { subCategoryDesc: { contains: search } },
            ],
          }
        : {};

      // Fetch categories based on search condition
      const categories = await prisma.fatsCategory.findMany({
        where: searchCondition,
        orderBy: { mainCatCode: "asc" },
      });

      if (categories.length === 0) {
        throw new MyError("No categories found for export", 404);
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("FATS Categories");

      // Define columns
      worksheet.columns = [
        { header: "Main Category Code", key: "mainCatCode", width: 20 },
        {
          header: "Main Category Description",
          key: "mainCategoryDesc",
          width: 35,
        },
        { header: "Main Description", key: "mainDescription", width: 35 },
        { header: "Sub Category Code", key: "subCategoryCode", width: 20 },
        {
          header: "Sub Category Description",
          key: "subCategoryDesc",
          width: 35,
        },
        { header: "Created At", key: "createdAt", width: 20 },
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
            mainCatCode: category?.mainCatCode || "",
            mainCategoryDesc: category?.mainCategoryDesc || "",
            mainDescription: category?.mainDescription || "",
            subCategoryCode: category?.subCategoryCode || "",
            subCategoryDesc: category?.subCategoryDesc || "",
            createdAt: category?.createdAt
              ? new Date(category.createdAt).toLocaleDateString()
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

      // Set filename based on whether it's filtered or not
      const filename = search
        ? `fats-categories-filtered-${search}.xlsx`
        : "fats-categories.xlsx";

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
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

export default FatsCategoryController;
