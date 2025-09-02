import { verifiedAssetSchema } from "../schemas/verifiedAsset.schema.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class VerifiedAssetController {
  static async create(req, res, next) {
    let uploadedPaths = [];
    try {
      const { error, value } = verifiedAssetSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Handle multiple image uploads
      if (req.files && req.files.length > 0) {
        const imagesArray = [];

        for (const file of req.files) {
          const imagePath = addDomain(file.path);
          uploadedPaths.push(imagePath);

          const imageObj = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            path: imagePath,
          };
          imagesArray.push(imageObj);
        }

        value.images = JSON.stringify(imagesArray);
      } else if (req.file) {
        // Fallback for single file upload
        const imagePath = addDomain(req.file.path);
        uploadedPaths.push(imagePath);

        const imageObj = {
          id: Date.now().toString(),
          path: imagePath,
        };
        value.images = JSON.stringify([imageObj]);
      }

      const verifiedAsset = await prisma.verifiedAsset.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(
            201,
            true,
            "Verified asset created successfully",
            verifiedAsset
          )
        );
    } catch (error) {
      // Clean up uploaded files on error
      if (uploadedPaths.length > 0) {
        for (const path of uploadedPaths) {
          try {
            await deleteFile(path);
          } catch (deleteError) {
            console.error("Error deleting file on error cleanup:", deleteError);
          }
        }
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
            OR: [
              { majorCategory: { contains: search } },
              { majorCategoryDescription: { contains: search } },
              { minorCategory: { contains: search } },
              { minorCategoryDescription: { contains: search } },
              { tagNumber: { contains: search } },
              { serialNumber: { contains: search } },
              { assetDescription: { contains: search } },
              { assetType: { contains: search } },
              { assetCondition: { contains: search } },
              { country: { contains: search } },
              { region: { contains: search } },
              { cityName: { contains: search } },
              { dao: { contains: search } },
              { daoName: { contains: search } },
              { businessUnit: { contains: search } },
              { buildingNo: { contains: search } },
              { floorNo: { contains: search } },
              { employeeId: { contains: search } },
              { poNumber: { contains: search } },
              { supplier: { contains: search } },
              { invoiceNo: { contains: search } },
              { modelOfAsset: { contains: search } },
              { manufacturer: { contains: search } },
              { ownership: { contains: search } },
              { terminalId: { contains: search } },
              { atmNumber: { contains: search } },
              { locationTag: { contains: search } },
              { buildingName: { contains: search } },
              { buildingAddress: { contains: search } },
              { userLoginId: { contains: search } },
              { phoneExtNo: { contains: search } },
              { fullLocationDetails: { contains: search } },
              { journalRefNo: { contains: search } },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.verifiedAsset.count({
        where: searchCondition,
      });

      // Get verified assets with pagination
      const items = await prisma.verifiedAsset.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Verified assets retrieved successfully", {
          items,
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

      const item = await prisma.verifiedAsset.findUnique({
        where: { id },
      });

      if (!item) {
        throw new MyError("Verified asset not found", 404);
      }

      res
        .status(200)
        .json(
          response(200, true, "Verified asset retrieved successfully", item)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    let uploadedPaths = [];
    try {
      const { id } = req.params;
      const { error, value } = verifiedAssetSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const verifiedAsset = await prisma.verifiedAsset.findUnique({
        where: { id },
      });

      if (!verifiedAsset) {
        throw new MyError("Verified asset not found", 404);
      }

      // Handle image upload (single file for update)
      if (req.file) {
        const imagePath = addDomain(req.file.path);
        uploadedPaths.push(imagePath);

        // Handle existing images - delete them
        if (verifiedAsset.images) {
          try {
            const existingImages = JSON.parse(verifiedAsset.images);
            // Delete old image files
            for (const img of existingImages) {
              try {
                await deleteFile(img.path);
              } catch (deleteError) {
                console.error("Error deleting existing image:", deleteError);
              }
            }
          } catch (e) {
            console.error("Error parsing existing images:", e);
          }
        }

        // Create new images array with the uploaded file
        const imageObj = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          path: imagePath,
        };
        value.images = JSON.stringify([imageObj]);
      }

      const item = await prisma.verifiedAsset.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(response(200, true, "Verified asset updated successfully", item));
    } catch (error) {
      // Clean up uploaded files on error
      if (uploadedPaths.length > 0) {
        for (const path of uploadedPaths) {
          try {
            await deleteFile(path);
          } catch (deleteError) {
            console.error("Error deleting file on error cleanup:", deleteError);
          }
        }
      }

      if (error.code === "P2025") {
        next(new MyError("Verified asset not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const verifiedAsset = await prisma.verifiedAsset.findUnique({
        where: { id },
      });

      if (!verifiedAsset) {
        throw new MyError("Verified asset not found", 404);
      }

      // Delete associated image files
      if (verifiedAsset.images) {
        try {
          const images = JSON.parse(verifiedAsset.images);
          // Delete all image files
          for (const img of images) {
            try {
              await deleteFile(img.path);
            } catch (deleteError) {
              console.error("Error deleting image file:", deleteError);
              // Continue with deletion even if file deletion fails
            }
          }
        } catch (e) {
          console.error("Error parsing images for deletion:", e);
        }
      }

      await prisma.verifiedAsset.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Verified asset deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Verified asset not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default VerifiedAssetController;
