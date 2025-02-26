import prisma from "../utils/prismaClient.js";
import assetVerificationSchema from "../schemas/assetVerification.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";

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

      const searchCondition = search
        ? {
            OR: [
              { tagNumber: { contains: search } },
              { serialNumber: { contains: search } },
              { faNumber: { contains: search } },
              { brand: { contains: search } },
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
}

export default AssetVerificationController;
