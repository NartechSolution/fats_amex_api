import { tblAssetMasterEncodeAssetCaptureFinalSchema } from "../schemas/TblAssetMasterEncodeAssetCaptureFinal.schema.js";
import MyError from "../utils/error.js";
import { addDomain, deleteFile } from "../utils/file.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class TblAssetMasterEncodeAssetCaptureFinalController {
  static async create(req, res, next) {
    let imagePath;
    try {
      const { error, value } =
        tblAssetMasterEncodeAssetCaptureFinalSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      if (req.file) {
        imagePath = req.file.path;
        value.image = imagePath;
      }

      const assetMaster =
        await prisma.tblAssetMasterEncodeAssetCaptureFinal.create({
          data: value,
        });

      res
        .status(201)
        .json(
          response(
            201,
            true,
            "Asset master record created successfully",
            assetMaster
          )
        );
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
      const total = await prisma.tblAssetMasterEncodeAssetCaptureFinal.count({
        where: searchCondition,
      });

      // Get asset master records with pagination
      const items = await prisma.tblAssetMasterEncodeAssetCaptureFinal.findMany(
        {
          where: searchCondition,
          skip,
          take: Number(limit),
          orderBy: {
            [sortBy]: order,
          },
        }
      );

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Asset master records retrieved successfully", {
          items,
          pagination: {
            total,
            page: Number(page),
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
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

      const item =
        await prisma.tblAssetMasterEncodeAssetCaptureFinal.findUnique({
          where: { id },
        });

      if (!item) {
        throw new MyError("Asset master record not found", 404);
      }

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset master record retrieved successfully",
            item
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } =
        tblAssetMasterEncodeAssetCaptureFinalSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const assetMaster =
        await prisma.tblAssetMasterEncodeAssetCaptureFinal.findUnique({
          where: { id },
        });

      if (!assetMaster) {
        throw new MyError("Asset master record not found", 404);
      }

      if (req.file) {
        const imagePath = addDomain(req.file.path);
        value.image = imagePath;
        if (assetMaster.image) {
          await deleteFile(assetMaster.image);
        }
      }

      const item = await prisma.tblAssetMasterEncodeAssetCaptureFinal.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(
          response(200, true, "Asset master record updated successfully", item)
        );
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Asset master record not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const assetMaster =
        await prisma.tblAssetMasterEncodeAssetCaptureFinal.findUnique({
          where: { id },
        });

      if (!assetMaster) {
        throw new MyError("Asset master record not found", 404);
      }

      if (assetMaster.image) {
        await deleteFile(assetMaster.image);
      }

      await prisma.tblAssetMasterEncodeAssetCaptureFinal.delete({
        where: { id },
      });

      res
        .status(200)
        .json(
          response(200, true, "Asset master record deleted successfully", null)
        );
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Asset master record not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default TblAssetMasterEncodeAssetCaptureFinalController;
