import { wbsInventorySchema } from "../schemas/wbsInventory.schema.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";
import ExcelJS from "exceljs";

class WbsInventoryController {
  static async create(req, res, next) {
    let imagePath;
    try {
      const { error, value } = wbsInventorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if category exists
      const category = await prisma.wbsCategory.findUnique({
        where: { id: value.categoryId },
      });

      if (!category) {
        throw new MyError("Category not found", 404);
      }

      if (req.file) {
        imagePath = addDomain(req.file.path);
        value.image = imagePath;
      }

      // Check if serialNumber is unique if provided
      if (value.serialNumber) {
        const existingInventory = await prisma.wbsInventory.findFirst({
          where: { serialNumber: value.serialNumber },
        });

        if (existingInventory) {
          throw new MyError("Serial number already exists", 409);
        }
      }

      // Extract modifiers array and remove it from value object
      const { modifiers, ...inventoryData } = value;

      // Create inventory with relations
      const inventory = await prisma.wbsInventory.create({
        data: {
          ...inventoryData,
          modifiers: {
            connect: modifiers?.map((id) => ({ id })) || [],
          },
        },
        include: {
          category: true,
          modifiers: true,
        },
      });

      res
        .status(201)
        .json(response(201, true, "Inventory created successfully", inventory));
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
        categoryId,
      } = req.query;

      const skip = (page - 1) * limit;

      // Build search conditions
      let searchCondition = search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
              { batchNumber: { contains: search } },
              { serialNumber: { contains: search } },
              { assetLocation: { contains: search } },
            ],
          }
        : {};

      // Add category filter if provided
      if (categoryId) {
        searchCondition = {
          ...searchCondition,
          categoryId,
        };
      }

      // Get total count
      const total = await prisma.wbsInventory.count({
        where: searchCondition,
      });

      // Get inventories with pagination
      const inventories = await prisma.wbsInventory.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        include: {
          category: true,
          modifiers: true,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Inventories retrieved successfully", {
          inventories,
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

      const inventory = await prisma.wbsInventory.findUnique({
        where: { id },
        include: {
          category: true,
          modifiers: true,
        },
      });

      if (!inventory) {
        throw new MyError("Inventory not found", 404);
      }

      res
        .status(200)
        .json(
          response(200, true, "Inventory retrieved successfully", inventory)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = wbsInventorySchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if inventory exists
      const existingInventory = await prisma.wbsInventory.findUnique({
        where: { id },
      });

      if (!existingInventory) {
        throw new MyError("Inventory not found", 404);
      }

      // Check if category exists
      const category = await prisma.wbsCategory.findUnique({
        where: { id: value.categoryId },
      });

      if (!category) {
        throw new MyError("Category not found", 404);
      }

      // Handle image upload
      if (req.file) {
        const imagePath = addDomain(req.file.path);
        value.image = imagePath;
        if (existingInventory.image) {
          await deleteFile(existingInventory.image);
        }
      }

      // Check if new serialNumber conflicts with existing ones
      if (
        value.serialNumber &&
        value.serialNumber !== existingInventory.serialNumber
      ) {
        const conflictingInventory = await prisma.wbsInventory.findUnique({
          where: { serialNumber: value.serialNumber },
        });

        if (conflictingInventory) {
          throw new MyError("Serial number already exists", 409);
        }
      }

      // Extract modifiers array and remove it from value object
      const { modifiers, ...inventoryData } = value;

      // Update inventory with relations
      const inventory = await prisma.wbsInventory.update({
        where: { id },
        data: {
          ...inventoryData,
          modifiers: {
            set: [], // First disconnect all existing modifiers
            connect: modifiers?.map((id) => ({ id })) || [], // Then connect new ones
          },
        },
        include: {
          category: true,
          modifiers: true,
        },
      });

      res
        .status(200)
        .json(response(200, true, "Inventory updated successfully", inventory));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const inventory = await prisma.wbsInventory.findUnique({
        where: { id },
      });

      if (!inventory) {
        throw new MyError("Inventory not found", 404);
      }

      // Delete associated image if exists
      if (inventory.image) {
        await deleteFile(inventory.image);
      }

      await prisma.wbsInventory.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Inventory deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Inventory not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async exportExcel(req, res, next) {
    try {
      console.log("[Excel Export] Starting inventory export process");

      // Fetch all inventories with relations
      const inventories = await prisma.wbsInventory.findMany({
        include: {
          category: true,
          modifiers: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (inventories.length === 0) {
        throw new MyError("No inventories found for export", 404);
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inventories");

      // Define columns
      worksheet.columns = [
        { header: "Name", key: "name", width: 30 },
        { header: "Description", key: "description", width: 50 },
        { header: "Price", key: "price", width: 15 },
        { header: "Quantity", key: "quantity", width: 15 },
        { header: "Batch Number", key: "batchNumber", width: 20 },
        { header: "Serial Number", key: "serialNumber", width: 20 },
        { header: "Asset Location", key: "assetLocation", width: 30 },
        { header: "Category", key: "category", width: 20 },
        { header: "Modifiers", key: "modifiers", width: 50 },
        { header: "Expiry Date", key: "expiryDate", width: 20 },
        { header: "Manufacture Date", key: "manufactureDate", width: 20 },
        { header: "Created At", key: "createdAt", width: 20 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add inventory data
      inventories.forEach((inventory) => {
        try {
          const rowData = {
            name: inventory?.name || "",
            description: inventory?.description || "",
            price: inventory?.price || 0,
            quantity: inventory?.quantity || 0,
            batchNumber: inventory?.batchNumber || "",
            serialNumber: inventory?.serialNumber || "",
            assetLocation: inventory?.assetLocation || "",
            category: inventory?.category?.name || "",
            modifiers: Array.isArray(inventory?.modifiers)
              ? inventory.modifiers
                  .map((mod) => mod?.name || "")
                  .filter(Boolean)
                  .join(", ")
              : "",
            expiryDate: inventory?.expiryDate
              ? new Date(inventory.expiryDate).toLocaleDateString()
              : "",
            manufactureDate: inventory?.manufactureDate
              ? new Date(inventory.manufactureDate).toLocaleDateString()
              : "",
            createdAt: inventory?.createdAt
              ? new Date(inventory.createdAt).toLocaleDateString()
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
            `Error adding row for inventory ${inventory?.id || "unknown"}:`,
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
        'attachment; filename="inventories.xlsx"'
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

export default WbsInventoryController;
