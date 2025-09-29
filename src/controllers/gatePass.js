import {
  gatePassDetailSchema,
  gatePassSchema,
  gatePassUpdateSchema,
} from "../schemas/gatePass.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class GatePassController {
  static async create(req, res, next) {
    try {
      const { error, value } = gatePassSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Separate details from main gate pass data
      const { details, ...gatePassData } = value;

      // Create gate pass with details
      const gatePass = await prisma.gatePass.create({
        data: {
          ...gatePassData,
          details: details
            ? {
                create: details,
              }
            : undefined,
        },
        include: {
          details: true,
        },
      });

      res
        .status(201)
        .json(response(201, true, "Gate pass created successfully", gatePass));
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
        includeDetails = "true",
      } = req.query;

      const skip = (page - 1) * limit;

      // Build search conditions
      const searchCondition = search
        ? {
            OR: [
              { gatePassNo: { contains: search } },
              { gatePassType: { contains: search } },
              { sourceSite: { contains: search } },
              { destinationSite: { contains: search } },
              { sender: { contains: search } },
              { receiver: { contains: search } },
              { driverName: { contains: search } },
              { vehicleNo: { contains: search } },
              { vehicleCompany: { contains: search } },
              { preparedBy: { contains: search } },
              { hodName: { contains: search } },
              { hodStatus: { contains: search } },
              { authorizedBy: { contains: search } },
              { authorizedStatus: { contains: search } },
              { remarks: { contains: search } },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.gatePass.count({
        where: searchCondition,
      });

      // Get gate passes with pagination
      const items = await prisma.gatePass.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
        include:
          includeDetails === "true"
            ? {
                details: {
                  orderBy: { srNo: "asc" },
                },
              }
            : false,
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Gate passes retrieved successfully", {
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
      const { includeDetails = "true" } = req.query;

      const item = await prisma.gatePass.findUnique({
        where: { id },
        include:
          includeDetails === "true"
            ? {
                details: {
                  orderBy: { srNo: "asc" },
                },
              }
            : false,
      });

      if (!item) {
        throw new MyError("Gate pass not found", 404);
      }

      res
        .status(200)
        .json(response(200, true, "Gate pass retrieved successfully", item));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = gatePassUpdateSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const gatePass = await prisma.gatePass.findUnique({
        where: { id },
        include: { details: true },
      });

      if (!gatePass) {
        throw new MyError("Gate pass not found", 404);
      }

      // Separate details from main gate pass data
      const { details, ...gatePassData } = value;

      let updateData = { ...gatePassData };

      // Handle details update if provided
      if (details) {
        // Delete existing details
        await prisma.gatePassDetail.deleteMany({
          where: { gatePassId: id },
        });

        // Create new details
        updateData.details = {
          create: details,
        };
      }

      const item = await prisma.gatePass.update({
        where: { id },
        data: updateData,
        include: {
          details: {
            orderBy: { srNo: "asc" },
          },
        },
      });

      res
        .status(200)
        .json(response(200, true, "Gate pass updated successfully", item));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Gate pass not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const gatePass = await prisma.gatePass.findUnique({
        where: { id },
        include: { details: true },
      });

      if (!gatePass) {
        throw new MyError("Gate pass not found", 404);
      }

      // Delete gate pass and its details (cascading delete)
      await prisma.gatePass.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Gate pass deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Gate pass not found", 404));
      } else {
        next(error);
      }
    }
  }

  // Detail-specific operations
  static async createDetail(req, res, next) {
    try {
      const { error, value } = gatePassDetailSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if gate pass exists
      const gatePass = await prisma.gatePass.findUnique({
        where: { id: value.gatePassId },
      });

      if (!gatePass) {
        throw new MyError("Gate pass not found", 404);
      }

      const detail = await prisma.gatePassDetail.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(201, true, "Gate pass detail created successfully", detail)
        );
    } catch (error) {
      next(error);
    }
  }

  static async getDetailsByGatePassId(req, res, next) {
    try {
      const { gatePassId } = req.params;
      const {
        page = 1,
        limit = 10,
        sortBy = "srNo",
        order = "asc",
      } = req.query;

      const skip = (page - 1) * limit;

      // Check if gate pass exists
      const gatePass = await prisma.gatePass.findUnique({
        where: { id: gatePassId },
      });

      if (!gatePass) {
        throw new MyError("Gate pass not found", 404);
      }

      // Get total count
      const total = await prisma.gatePassDetail.count({
        where: { gatePassId },
      });

      // Get details with pagination
      const items = await prisma.gatePassDetail.findMany({
        where: { gatePassId },
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Gate pass details retrieved successfully", {
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

  static async updateDetail(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = gatePassDetailSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const detail = await prisma.gatePassDetail.findUnique({
        where: { id: Number(id) },
      });

      if (!detail) {
        throw new MyError("Gate pass detail not found", 404);
      }

      const item = await prisma.gatePassDetail.update({
        where: { id: Number(id) },
        data: value,
      });

      res
        .status(200)
        .json(
          response(200, true, "Gate pass detail updated successfully", item)
        );
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Gate pass detail not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async deleteDetail(req, res, next) {
    try {
      const { id } = req.params;

      const detail = await prisma.gatePassDetail.findUnique({
        where: { id: Number(id) },
      });

      if (!detail) {
        throw new MyError("Gate pass detail not found", 404);
      }

      await prisma.gatePassDetail.delete({
        where: { id: Number(id) },
      });

      res
        .status(200)
        .json(
          response(200, true, "Gate pass detail deleted successfully", null)
        );
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Gate pass detail not found", 404));
      } else {
        next(error);
      }
    }
  }
}

export default GatePassController;
