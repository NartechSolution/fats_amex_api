import prisma from "../utils/prismaClient.js";
import departmentSchema from "../schemas/department.schema.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";

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
}

export default DepartmentController;
