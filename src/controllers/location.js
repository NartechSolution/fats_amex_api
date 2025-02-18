import { locationSchema } from "../schemas/location.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";

class LocationController {
  static async create(req, res, next) {
    try {
      const { error, value } = locationSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }
      if (value.locationCode) {
        const existingLocation = await prisma.location.findFirst({
          where: { locationCode: value.locationCode },
        });
        if (existingLocation) {
          throw new MyError("Location with this code already exists", 409);
        }
      }
      const location = await prisma.location.create({
        data: value,
      });
      res
        .status(201)
        .json(response(201, true, "Location created successfully", location));
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
            OR: [
              { company: { contains: search } },
              { building: { contains: search } },
              { levelFloor: { contains: search } },
              { office: { contains: search } },
              { room: { contains: search } },
              { locationCode: { contains: search } },
            ],
          }
        : {};
      const total = await prisma.location.count({ where: searchCondition });
      const locations = await prisma.location.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: order },
      });
      const totalPages = Math.ceil(total / limit);
      res.status(200).json(
        response(200, true, "Locations retrieved successfully", {
          locations,
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
      const location = await prisma.location.findUnique({
        where: { id },
      });
      if (!location) {
        throw new MyError("Location not found", 404);
      }
      res
        .status(200)
        .json(response(200, true, "Location retrieved successfully", location));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = locationSchema.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }
      const existingLocation = await prisma.location.findUnique({
        where: { id },
      });
      if (!existingLocation) {
        throw new MyError("Location not found", 404);
      }
      if (
        value.locationCode &&
        value.locationCode !== existingLocation.locationCode
      ) {
        const conflictingLocation = await prisma.location.findFirst({
          where: { locationCode: value.locationCode },
        });
        if (conflictingLocation) {
          throw new MyError("Location with this code already exists", 409);
        }
      }
      const updatedLocation = await prisma.location.update({
        where: { id },
        data: value,
      });
      res
        .status(200)
        .json(
          response(200, true, "Location updated successfully", updatedLocation)
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const location = await prisma.location.findUnique({
        where: { id },
      });
      if (!location) {
        throw new MyError("Location not found", 404);
      }
      await prisma.location.delete({
        where: { id },
      });
      res
        .status(200)
        .json(response(200, true, "Location deleted successfully", null));
    } catch (error) {
      next(error);
    }
  }
}

export default LocationController;
