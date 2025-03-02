import prisma from "../utils/prismaClient.js";
import departmentSchema from "../schemas/department.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";
import ExcelJS from "exceljs";

class DepartmentController {
  static async create(req, res, next) {
    try {
      const { error, value } = departmentSchema.create.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const department = await prisma.department.create({
        data: value,
      });

      res
        .status(201)
        .json(
          response(201, true, "Department created successfully", department)
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

      // Build search conditions
      const searchCondition = search
        ? {
            OR: [{ name: { contains: search } }],
          }
        : {};

      // Get total count
      const total = await prisma.department.count({
        where: searchCondition,
      });

      // Get departments with pagination
      const departments = await prisma.department.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Departments retrieved successfully", {
          departments,
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

      const department = await prisma.department.findUnique({
        where: { id },
      });

      if (!department) {
        throw new MyError("Department not found", 404);
      }

      res
        .status(200)
        .json(
          response(200, true, "Department retrieved successfully", department)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = departmentSchema.update.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingDepartment = await prisma.department.findUnique({
        where: { id },
      });

      if (!existingDepartment) {
        throw new MyError("Department not found", 404);
      }

      const department = await prisma.department.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(
          response(200, true, "Department updated successfully", department)
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const department = await prisma.department.findUnique({
        where: { id },
      });

      if (!department) {
        throw new MyError("Department not found", 404);
      }

      await prisma.department.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Department deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Department not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async exportExcel(req, res, next) {
    try {
      console.log("[Excel Export] Starting departments export process");

      // Fetch all departments
      const departments = await prisma.department.findMany({
        orderBy: { name: "asc" },
      });

      if (departments.length === 0) {
        throw new MyError("No departments found for export", 404);
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Departments");

      // Define columns
      worksheet.columns = [
        { header: "Name", key: "name", width: 30 },
        { header: "Created At", key: "createdAt", width: 20 },
        { header: "Updated At", key: "updatedAt", width: 20 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add department data
      departments.forEach((department) => {
        try {
          const rowData = {
            name: department?.name || "",
            createdAt: department?.createdAt
              ? new Date(department.createdAt).toLocaleDateString()
              : "",
            updatedAt: department?.updatedAt
              ? new Date(department.updatedAt).toLocaleDateString()
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
            `Error adding row for department ${department?.id || "unknown"}:`,
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
      const filename = "departments.xlsx";

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

  static async bulkCreate(req, res, next) {
    try {
      console.log("[Bulk Create] Starting departments bulk create process");

      const departments = req.body;

      if (!Array.isArray(departments)) {
        throw new MyError("Request body must be an array of departments", 400);
      }

      if (departments.length === 0) {
        throw new MyError("No departments provided for import", 400);
      }

      console.log(`[Bulk Create] Processing ${departments.length} departments`);

      // Validate each department
      const validatedDepartments = [];
      for (const department of departments) {
        const { error, value } = departmentSchema.create.validate(department);
        if (error) {
          throw new MyError(
            `Validation error: ${error.details[0].message}`,
            400
          );
        }
        validatedDepartments.push(value);
      }

      // Check for duplicate names in the request
      const departmentNames = validatedDepartments.map((dept) => dept.name);
      const uniqueNames = new Set(departmentNames);
      if (uniqueNames.size !== departmentNames.length) {
        throw new MyError("Duplicate department names found in request", 400);
      }

      // Check for existing names in database
      const existingDepartments = await prisma.department.findMany({
        where: {
          name: {
            in: departmentNames,
          },
        },
      });

      if (existingDepartments.length > 0) {
        throw new MyError(
          `Departments with names ${existingDepartments
            .map((e) => e.name)
            .join(", ")} already exist`,
          409
        );
      }

      // Bulk create departments
      const createdDepartments = await prisma.department.createMany({
        data: validatedDepartments,
      });

      res.status(201).json(
        response(201, true, "Departments created successfully", {
          count: createdDepartments.count,
        })
      );
    } catch (error) {
      console.error("[Bulk Create Error]", error);
      next(error);
    }
  }
}

export default DepartmentController;
