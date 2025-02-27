import prisma from "../utils/prismaClient.js";
import employSchema from "../schemas/employ.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";

class EmployeeController {
  static async create(req, res, next) {
    try {
      const { error, value } = employSchema.create.validate(req.body);
      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      // Check if employee ID already exists
      const existingEmployee = await prisma.employee.findFirst({
        where: { employeeId: value.employeeId },
      });

      if (existingEmployee) {
        throw new MyError("Employee ID already exists", 400);
      }

      const employee = await prisma.employee.create({
        data: value,
      });

      res
        .status(201)
        .json(response(201, true, "Employee created successfully", employee));
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
            OR: [
              { employeeId: { contains: search } },
              { name: { contains: search } },
            ],
          }
        : {};

      // Get total count
      const total = await prisma.employee.count({
        where: searchCondition,
      });

      // Get employees with pagination
      const employees = await prisma.employee.findMany({
        where: searchCondition,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        response(200, true, "Employees retrieved successfully", {
          employees,
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

      const employee = await prisma.employee.findUnique({
        where: { id },
      });

      if (!employee) {
        throw new MyError("Employee not found", 404);
      }

      res
        .status(200)
        .json(response(200, true, "Employee retrieved successfully", employee));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { error, value } = employSchema.update.validate(req.body);

      if (error) {
        throw new MyError(error.details[0].message, 400);
      }

      const existingEmployee = await prisma.employee.findUnique({
        where: { id },
      });

      if (!existingEmployee) {
        throw new MyError("Employee not found", 404);
      }

      // If employeeId is being updated, check if it already exists
      if (
        value.employeeId &&
        value.employeeId !== existingEmployee.employeeId
      ) {
        const duplicateEmployee = await prisma.employee.findFirst({
          where: { employeeId: value.employeeId },
        });

        if (duplicateEmployee) {
          throw new MyError("Employee ID already exists", 400);
        }
      }

      const employee = await prisma.employee.update({
        where: { id },
        data: value,
      });

      res
        .status(200)
        .json(response(200, true, "Employee updated successfully", employee));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const employee = await prisma.employee.findUnique({
        where: { id },
      });

      if (!employee) {
        throw new MyError("Employee not found", 404);
      }

      await prisma.employee.delete({
        where: { id },
      });

      res
        .status(200)
        .json(response(200, true, "Employee deleted successfully", null));
    } catch (error) {
      if (error.code === "P2025") {
        next(new MyError("Employee not found", 404));
      } else {
        next(error);
      }
    }
  }

  static async bulkCreate(req, res, next) {
    try {
      const employees = req.body;

      if (!Array.isArray(employees)) {
        throw new MyError("Request body must be an array of employees", 400);
      }

      // Validate each employee
      const validatedEmployees = [];
      for (const employee of employees) {
        const { error, value } = employSchema.create.validate(employee);
        if (error) {
          throw new MyError(
            `Validation error: ${error.details[0].message}`,
            400
          );
        }
        validatedEmployees.push(value);
      }

      // Check for duplicate employeeIds in the request
      const employeeIds = validatedEmployees.map((emp) => emp.employeeId);
      const uniqueIds = new Set(employeeIds);
      if (uniqueIds.size !== employeeIds.length) {
        throw new MyError("Duplicate employee IDs found in request", 400);
      }

      // Check for existing employeeIds in database
      const existingEmployees = await prisma.employee.findMany({
        where: {
          employeeId: {
            in: employeeIds,
          },
        },
      });

      if (existingEmployees.length > 0) {
        throw new MyError(
          `Employees with IDs ${existingEmployees
            .map((e) => e.employeeId)
            .join(", ")} already exist`,
          409
        );
      }

      // Bulk create employees
      const createdEmployees = await prisma.employee.createMany({
        data: validatedEmployees,
      });

      res.status(201).json(
        response(201, true, "Employees created successfully", {
          count: createdEmployees.count,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeController;
