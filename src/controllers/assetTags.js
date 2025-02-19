import {
  generateAssetTagsSchema,
  assetTagSchema,
} from "../schemas/assetTags.schema.js";
import { generateTagNumbers } from "../utils/tagNumberGenerator.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

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
      const searchCondition = search
        ? {
            OR: [{ tagNumber: { contains: search } }],
          }
        : {};

      // Combine the search condition with the filter for asset tags that are not verified
      const whereCondition = {
        isVerified: false,
        ...searchCondition,
      };

      const total = await prisma.assetTag.count({ where: whereCondition });
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
}

export default AssetTagsController;
