import prisma from "../utils/prismaClient.js";
import assetVerificationSchema from "../schemas/assetVerification.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";
import ExcelJS from "exceljs";

class AssetVerificationController {
  static async create(req, res, next) {
    const imagePaths = [];
    try {
      const { error, value } = assetVerificationSchema.create.validate(
        req.body
      );
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Handle multiple image uploads
      if (req.files) {
        for (let i = 1; i <= 5; i++) {
          const fieldName = `image${i}`;
          if (req.files[fieldName] && req.files[fieldName][0]) {
            const imagePath = addDomain(req.files[fieldName][0].path);
            value[fieldName] = imagePath;
            imagePaths.push(imagePath);
          }
        }
      }

      const assetVerification = await prisma.assetVerification.create({
        data: value,
      });

      // Delete the corresponding AssetTag record if tagNumber exists
      if (value.tagNumber) {
        await prisma.assetTag.deleteMany({
          where: {
            tagNumber: value.tagNumber,
          },
        });
      }

      res
        .status(201)
        .json(
          response(
            201,
            true,
            "Asset verification created successfully",
            assetVerification
          )
        );
    } catch (error) {
      // Delete uploaded images if there's an error
      for (const imagePath of imagePaths) {
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

      // First, find matching location IDs and category IDs based on search
      const [matchingLocations, matchingCategories] = await Promise.all([
        prisma.location.findMany({
          where: {
            locationCode: { contains: search },
          },
          select: { id: true },
        }),
        prisma.fatsCategory.findMany({
          where: {
            OR: [
              { mainCategoryDesc: { contains: search } },
              { subCategoryDesc: { contains: search } },
            ],
          },
          select: { id: true },
        }),
      ]);

      const searchCondition = search
        ? {
            OR: [
              { tagNumber: { contains: search } },
              { serialNumber: { contains: search } },
              { faNumber: { contains: search } },
              { brand: { contains: search } },
              { locationId: { in: matchingLocations.map((loc) => loc.id) } },
              {
                assetCategoryId: {
                  in: matchingCategories.map((cat) => cat.id),
                },
              },
            ],
          }
        : {};

      const total = await prisma.assetVerification.count({
        where: searchCondition,
      });

      // Get basic asset verification data for table
      const assetVerifications = await prisma.assetVerification.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        select: {
          id: true,
          tagNumber: true,
          assetCondition: true,
          assetStatus: true,
          brand: true,
          serialNumber: true,
          locationId: true,
          assetCategoryId: true,
          employeeId: true,
          createdAt: true,
          image1: true,
          assetDescription: true,
        },
      });

      // Fetch related data for each asset verification
      const enrichedAssetVerifications = await Promise.all(
        assetVerifications.map(async (asset) => {
          const [location, category, employee] = await Promise.all([
            asset.locationId
              ? prisma.location.findUnique({
                  where: { id: asset.locationId },
                  select: {
                    company: true,
                    locationCode: true,
                  },
                })
              : null,
            asset.assetCategoryId
              ? prisma.fatsCategory.findUnique({
                  where: { id: asset.assetCategoryId },
                  select: {
                    mainCategoryDesc: true,
                    subCategoryDesc: true,
                  },
                })
              : null,
            asset.employeeId
              ? prisma.employee.findUnique({
                  where: { id: asset.employeeId },
                  select: {
                    name: true,
                  },
                })
              : null,
          ]);

          return {
            id: asset.id,
            tagNumber: asset.tagNumber,
            assetCondition: asset.assetCondition,
            assetStatus: asset.assetStatus,
            brand: asset.brand,
            serialNumber: asset.serialNumber,
            createdAt: asset.createdAt,
            location: location?.company,
            locationCode: location?.locationCode,
            category: category?.mainCategoryDesc,
            subCategory: category?.subCategoryDesc,
            employeeName: employee?.name,
            assetDescription: asset.assetDescription,
            image1: asset.image1,
          };
        })
      );

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Asset verifications retrieved successfully", {
          assetVerifications: enrichedAssetVerifications,
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

      const assetVerification = await prisma.assetVerification.findUnique({
        where: { id },
      });

      if (!assetVerification) {
        throw new MyError("Asset verification not found", 404);
      }

      // Fetch all related data
      const [location, category, employee] = await Promise.all([
        assetVerification.locationId
          ? prisma.location.findUnique({
              where: { id: assetVerification.locationId },
            })
          : null,
        assetVerification.assetCategoryId
          ? prisma.fatsCategory.findUnique({
              where: { id: assetVerification.assetCategoryId },
            })
          : null,
        assetVerification.employeeId
          ? prisma.employee.findFirst({
              where: { employeeId: assetVerification.employeeId },
            })
          : null,
      ]);

      const fullAssetVerification = {
        ...assetVerification,
        location,
        category,
        employee,
      };

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset verification retrieved successfully",
            fullAssetVerification
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const imagePaths = [];
    try {
      const { id } = req.params;
      const { error, value } = assetVerificationSchema.update.validate(
        req.body
      );

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingAssetVerification =
        await prisma.assetVerification.findUnique({
          where: { id },
        });

      if (!existingAssetVerification) {
        throw new MyError("Asset verification not found", 404);
      }

      // Handle multiple image uploads
      if (req.files) {
        for (let i = 1; i <= 5; i++) {
          const fieldName = `image${i}`;
          if (req.files[fieldName] && req.files[fieldName][0]) {
            // Delete old image if exists
            if (existingAssetVerification[fieldName]) {
              await deleteFile(existingAssetVerification[fieldName]);
            }
            const imagePath = addDomain(req.files[fieldName][0].path);
            value[fieldName] = imagePath;
            imagePaths.push(imagePath);
          }
        }
      }

      const assetVerification = await prisma.assetVerification.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset verification updated successfully",
            assetVerification
          )
        );
    } catch (error) {
      // Delete uploaded images if there's an error
      for (const imagePath of imagePaths) {
        await deleteFile(imagePath);
      }
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const assetVerification = await prisma.assetVerification.findUnique({
        where: { id },
      });

      if (!assetVerification) {
        throw new MyError("Asset verification not found", 404);
      }

      // Delete all associated images
      for (let i = 1; i <= 5; i++) {
        const fieldName = `image${i}`;
        if (assetVerification[fieldName]) {
          await deleteFile(assetVerification[fieldName]);
        }
      }

      await prisma.assetVerification.delete({
        where: { id },
      });

      res
        .status(200)
        .json(
          response(200, true, "Asset verification deleted successfully", null)
        );
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Asset verification not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async exportExcel(req, res, next) {
    try {
      console.log("[Excel Export] Starting asset verification export process");

      // Fetch all asset verifications
      const assetVerifications = await prisma.assetVerification.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (assetVerifications.length === 0) {
        throw new MyError("No asset verifications found for export", 404);
      }

      // Fetch related data for all asset verifications
      const assetVerificationsWithRelations = await Promise.all(
        assetVerifications.map(async (asset) => {
          const [location, category, employee] = await Promise.all([
            asset.locationId
              ? prisma.location.findUnique({
                  where: { id: asset.locationId },
                  select: {
                    company: true,
                    locationCode: true,
                  },
                })
              : null,
            asset.assetCategoryId
              ? prisma.fatsCategory.findUnique({
                  where: { id: asset.assetCategoryId },
                  select: {
                    mainCategoryDesc: true,
                    subCategoryDesc: true,
                  },
                })
              : null,
            asset.employeeId
              ? prisma.employee.findUnique({
                  where: { id: asset.employeeId },
                  select: {
                    name: true,
                  },
                })
              : null,
          ]);

          return {
            ...asset,
            location,
            category,
            employee,
          };
        })
      );

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Asset Verifications");

      // Define columns
      worksheet.columns = [
        { header: "Tag Number", key: "tagNumber", width: 20 },
        { header: "Asset Condition", key: "assetCondition", width: 20 },
        { header: "Asset Status", key: "assetStatus", width: 20 },
        { header: "Brand", key: "brand", width: 20 },
        { header: "Model", key: "modal", width: 20 },
        { header: "Serial Number", key: "serialNumber", width: 25 },
        { header: "FA Number", key: "faNumber", width: 20 },
        { header: "Ext Number", key: "extNumber", width: 20 },
        { header: "Location", key: "location", width: 25 },
        { header: "Location Code", key: "locationCode", width: 20 },
        { header: "Category", key: "category", width: 25 },
        { header: "Sub Category", key: "subCategory", width: 25 },
        { header: "Old Tag Number", key: "assetOldTagNumber", width: 20 },
        { header: "Employee", key: "employee", width: 25 },
        { header: "Asset Description", key: "assetDescription", width: 40 },
        { header: "Created At", key: "createdAt", width: 20 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add asset verification data
      assetVerificationsWithRelations.forEach((asset) => {
        try {
          const rowData = {
            tagNumber: asset?.tagNumber || "",
            assetCondition: asset?.assetCondition || "",
            assetStatus: asset?.assetStatus || "",
            brand: asset?.brand || "",
            modal: asset?.modal || "",
            serialNumber: asset?.serialNumber || "",
            faNumber: asset?.faNumber || "",
            extNumber: asset?.extNumber || "",
            location: asset?.location?.company || "",
            locationCode: asset?.location?.locationCode || "",
            category: asset?.category?.mainCategoryDesc || "",
            subCategory: asset?.category?.subCategoryDesc || "",
            assetOldTagNumber: asset?.assetOldTagNumber || "",
            employee: asset?.employee?.name || "",
            assetDescription: asset?.assetDescription || "",
            createdAt: asset?.createdAt
              ? new Date(asset.createdAt).toLocaleDateString()
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
            `Error adding row for asset verification ${
              asset?.id || "unknown"
            }:`,
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
        'attachment; filename="asset-verifications.xlsx"'
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

export default AssetVerificationController;
