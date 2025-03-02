import { locationSchema } from "../schemas/location.schema.js";
import MyError from "../utils/error.js";
import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";
import ExcelJS from "exceljs";

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

  static async exportExcel(req, res, next) {
    try {
      console.log("[Excel Export] Starting locations export process");

      // Fetch all locations
      const locations = await prisma.location.findMany({
        orderBy: { locationCode: "asc" },
      });

      if (locations.length === 0) {
        throw new MyError("No locations found for export", 404);
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Locations");

      // Define columns
      worksheet.columns = [
        { header: "Location Code", key: "locationCode", width: 20 },
        { header: "Company", key: "company", width: 25 },
        { header: "Building", key: "building", width: 25 },
        { header: "Level/Floor", key: "levelFloor", width: 15 },
        { header: "Office", key: "office", width: 20 },
        { header: "Room", key: "room", width: 20 },
        { header: "Created At", key: "createdAt", width: 20 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add location data
      locations.forEach((location) => {
        try {
          const rowData = {
            locationCode: location?.locationCode || "",
            company: location?.company || "",
            building: location?.building || "",
            levelFloor: location?.levelFloor || "",
            office: location?.office || "",
            room: location?.room || "",
            createdAt: location?.createdAt
              ? new Date(location.createdAt).toLocaleDateString()
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
            `Error adding row for location ${location?.id || "unknown"}:`,
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

      // Set filename
      const filename = "locations.xlsx";

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

export default LocationController;
