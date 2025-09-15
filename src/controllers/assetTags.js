import {
  generateAssetTagsSchema,
  assetTagSchema,
  updateAssetTagSchema,
} from "../schemas/assetTags.schema.js";
import { generateTagNumbers } from "../utils/tagNumberGenerator.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";
import ExcelJS from "exceljs";

class AssetTagsController {
  static async generate(req, res, next) {
    try {
      const { error, value } = generateAssetTagsSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const { assetCaptureIds } = value;

      // Get all asset captures
      const assetCaptures = await prisma.assetCapture.findMany({
        where: {
          id: { in: assetCaptureIds },
          isGenerated: false,
        },
        include: {
          fatsCategory: true,
        },
      });

      if (assetCaptures.length === 0) {
        throw new MyError("No valid asset captures found for generation", 404);
      }

      const results = [];

      // Process each asset capture
      for (const capture of assetCaptures) {
        const quantity = capture.quantity || 1;
        const tagNumbers = await generateTagNumbers(
          capture.fatsCategoryId,
          quantity
        );

        // Create asset tags
        const assetTags = await Promise.all(
          tagNumbers.map((tagNumber) =>
            prisma.assetTag.create({
              data: {
                tagNumber,
                assetCaptureId: capture.id,
              },
            })
          )
        );

        // Update asset capture as generated
        await prisma.assetCapture.update({
          where: { id: capture.id },
          data: { isGenerated: true },
        });

        results.push({
          assetCaptureId: capture.id,
          generatedTags: assetTags,
        });
      }

      res.status(201).json(
        response(201, true, "Asset tags generated successfully", {
          results,
        })
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

      // Enhanced search condition to search across multiple fields and related tables
      const searchCondition = search
        ? {
            OR: [
              { tagNumber: { contains: search } },
              {
                assetCapture: {
                  OR: [
                    { assetDescription: { contains: search } },
                    { serialNumber: { contains: search } },
                    { brand: { contains: search } },
                    { modal: { contains: search } },
                    { faNumber: { contains: search } },
                    { extNumber: { contains: search } },
                    {
                      location: {
                        OR: [
                          { company: { contains: search } },
                          { building: { contains: search } },
                          { levelFloor: { contains: search } },
                          { office: { contains: search } },
                          { room: { contains: search } },
                          { locationCode: { contains: search } },
                        ],
                      },
                    },
                    {
                      fatsCategory: {
                        OR: [
                          { mainCatCode: { contains: search } },
                          { mainCategoryDesc: { contains: search } },
                          { mainDescription: { contains: search } },
                          { subCategoryCode: { contains: search } },
                          { subCategoryDesc: { contains: search } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          }
        : {};

      // Combine the search condition with the filter for asset tags that are not verified
      const whereCondition = {
        isVerified: false,
        ...searchCondition,
      };

      const total = await prisma.assetTag.count({
        where: whereCondition,
      });

      const assetTags = await prisma.assetTag.findMany({
        where: whereCondition,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
        include: {
          assetCapture: {
            include: {
              location: true,
              fatsCategory: true,
            },
          },
        },
      });

      const totalPages = Math.ceil(total / limit);
      res.status(200).json(
        response(200, true, "Asset tags retrieved successfully", {
          assetTags,
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
      const assetTag = await prisma.assetTag.findUnique({
        where: { id },
        include: {
          assetCapture: {
            include: {
              location: true,
              fatsCategory: true,
            },
          },
        },
      });

      if (!assetTag) {
        throw new MyError("Asset tag not found", 404);
      }

      res
        .status(200)
        .json(
          response(200, true, "Asset tag retrieved successfully", assetTag)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = updateAssetTagSchema.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if asset tag exists
      const existingAssetTag = await prisma.assetTag.findUnique({
        where: { id },
        include: { assetCapture: true },
      });

      if (!existingAssetTag) {
        throw new MyError("Asset tag not found", 404);
      }

      const { assetCapture, ...assetTagData } = value;

      // Update asset tag data
      let updatedAssetTag = existingAssetTag;
      if (Object.keys(assetTagData).length > 0) {
        updatedAssetTag = await prisma.assetTag.update({
          where: { id },
          data: assetTagData,
        });
      }

      // Update asset capture data if provided
      let updatedAssetCapture = existingAssetTag.assetCapture;
      if (assetCapture && Object.keys(assetCapture).length > 0) {
        updatedAssetCapture = await prisma.assetCapture.update({
          where: { id: existingAssetTag.assetCaptureId },
          data: assetCapture,
        });
      }

      // Fetch the complete updated asset tag with related data
      const finalAssetTag = await prisma.assetTag.findUnique({
        where: { id },
        include: {
          assetCapture: {
            include: {
              location: true,
              fatsCategory: true,
            },
          },
        },
      });

      res
        .status(200)
        .json(
          response(200, true, "Asset tag updated successfully", finalAssetTag)
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      // Extract the asset tag id from parameters
      const { assetTagId } = req.params;

      // Find the asset tag record by its id
      const assetTag = await prisma.assetTag.findUnique({
        where: { id: assetTagId },
      });

      if (!assetTag) {
        throw new MyError("Asset tag not found", 404);
      }

      // Get the assetCaptureId from the asset tag record
      const assetCaptureId = assetTag.assetCaptureId;

      // Delete the asset tag record
      await prisma.assetTag.delete({
        where: { id: assetTagId },
      });

      // Count remaining asset tags for the corresponding asset capture
      const remainingTagsCount = await prisma.assetTag.count({
        where: { assetCaptureId },
      });

      // If no other asset tags exist for this asset capture, delete the asset capture
      let assetCaptureDeleted = false;
      if (remainingTagsCount === 0) {
        await prisma.assetCapture.delete({
          where: { id: assetCaptureId },
        });
        assetCaptureDeleted = true;
      }

      res.status(200).json(
        response(200, true, "Asset tag deleted successfully", {
          assetTagId,
          assetCaptureDeleted,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getByTagNumber(req, res, next) {
    try {
      const { tagNumber } = req.params;

      const assetTag = await prisma.assetTag.findFirst({
        where: { tagNumber },
        include: {
          assetCapture: {
            include: {
              location: true,
              fatsCategory: true,
            },
          },
        },
      });

      if (!assetTag) {
        throw new MyError("Asset tag not found", 404);
      }

      res
        .status(200)
        .json(
          response(200, true, "Asset tag retrieved successfully", assetTag)
        );
    } catch (error) {
      next(error);
    }
  }

  static async exportExcel(req, res, next) {
    try {
      console.log("[Excel Export] Starting asset tags export process");

      // Fetch all asset tags with related data
      const assetTags = await prisma.assetTag.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          assetCapture: {
            include: {
              location: true,
              fatsCategory: true,
            },
          },
        },
      });

      if (assetTags.length === 0) {
        throw new MyError("No asset tags found for export", 404);
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Asset Tags");

      // Define columns
      worksheet.columns = [
        { header: "Tag Number", key: "tagNumber", width: 20 },
        { header: "Verification Status", key: "verificationStatus", width: 20 },
        { header: "Location", key: "location", width: 30 },
        { header: "Location Code", key: "locationCode", width: 20 },
        { header: "Main Category", key: "mainCategory", width: 30 },
        { header: "Sub Category", key: "subCategory", width: 30 },
        { header: "Asset Description", key: "assetDescription", width: 40 },
        { header: "Serial Number", key: "serialNumber", width: 25 },
        { header: "Brand", key: "brand", width: 20 },
        { header: "Model", key: "model", width: 20 },
        { header: "FA Number", key: "faNumber", width: 20 },
        { header: "Ext Number", key: "extNumber", width: 20 },
        { header: "Created At", key: "createdAt", width: 20 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add asset tag data
      assetTags.forEach((tag) => {
        try {
          const rowData = {
            tagNumber: tag?.tagNumber || "",
            verificationStatus: tag?.isVerified ? "Verified" : "Not Verified",
            location: tag?.assetCapture?.location?.company || "",
            locationCode: tag?.assetCapture?.location?.locationCode || "",
            mainCategory:
              tag?.assetCapture?.fatsCategory?.mainCategoryDesc || "",
            subCategory: tag?.assetCapture?.fatsCategory?.subCategoryDesc || "",
            assetDescription: tag?.assetCapture?.assetDescription || "",
            serialNumber: tag?.assetCapture?.serialNumber || "",
            brand: tag?.assetCapture?.brand || "",
            model: tag?.assetCapture?.modal || "",
            faNumber: tag?.assetCapture?.faNumber || "",
            extNumber: tag?.assetCapture?.extNumber || "",
            createdAt: tag?.createdAt
              ? new Date(tag.createdAt).toLocaleDateString()
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
            `Error adding row for asset tag ${tag?.id || "unknown"}:`,
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
        'attachment; filename="asset-tags.xlsx"'
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

export default AssetTagsController;
