import prisma from "../utils/prismaClient.js";
import response from "../utils/response.js";
import MyError from "../utils/error.js";

class FatsStatsController {
  static async getOverallStats(req, res, next) {
    try {
      // Get counts from all relevant models
      const [
        assetCaptureCount,
        assetTagsCount,
        assetVerificationCount,
        assetConditionCount,
        assetStatusCount,
        brandCount,
        departmentCount,
        employeeCount,
        fatsCategoryCount,
        locationCount,
        roleCount,
      ] = await Promise.all([
        prisma.assetCapture.count(),
        prisma.assetTag.count(),
        prisma.assetVerification.count(),
        prisma.assetCondition.count(),
        prisma.assetStatus.count(),
        prisma.brand.count(),
        prisma.department.count(),
        prisma.employee.count(),
        prisma.fatsCategory.count(),
        prisma.location.count(),
        prisma.role.count(),
      ]);

      const stats = {
        assetCapture: assetCaptureCount,
        assetTags: assetTagsCount,
        assetVerification: assetVerificationCount,
        assetCondition: assetConditionCount,
        assetStatus: assetStatusCount,
        brand: brandCount,
        department: departmentCount,
        employee: employeeCount,
        fatsCategory: fatsCategoryCount,
        location: locationCount,
        role: roleCount,
      };

      res
        .status(200)
        .json(response(200, true, "Stats retrieved successfully", stats));
    } catch (error) {
      next(error);
    }
  }

  static async getAssetCaptureStats(req, res, next) {
    try {
      // Get total count
      const totalCount = await prisma.assetCapture.count();

      // Get verified vs unverified counts
      const verifiedCount = await prisma.assetCapture.count({
        where: { isVerified: true },
      });

      // Get generated vs not generated counts
      const generatedCount = await prisma.assetCapture.count({
        where: { isGenerated: true },
      });

      // Get counts by location
      const countByLocation = await prisma.assetCapture.groupBy({
        by: ["locationId"],
        _count: true,
      });

      // Get location details for the counts
      const locationDetails = await prisma.location.findMany({
        where: {
          id: {
            in: countByLocation.map((item) => item.locationId),
          },
        },
        select: {
          id: true,
          company: true,
          building: true,
          levelFloor: true,
          locationCode: true,
        },
      });

      // Merge location details with counts
      const locationStats = countByLocation.map((item) => {
        const location = locationDetails.find(
          (loc) => loc.id === item.locationId
        );
        return {
          locationId: item.locationId,
          count: item._count,
          location: location || {
            id: item.locationId,
            company: "Unknown",
            building: "Unknown",
          },
        };
      });

      // Get counts by category
      const countByCategory = await prisma.assetCapture.groupBy({
        by: ["fatsCategoryId"],
        _count: true,
      });

      // Get category details
      const categoryDetails = await prisma.fatsCategory.findMany({
        where: {
          id: {
            in: countByCategory.map((item) => item.fatsCategoryId),
          },
        },
        select: {
          id: true,
          mainCategoryDesc: true,
          subCategoryDesc: true,
        },
      });

      // Merge category details with counts
      const categoryStats = countByCategory.map((item) => {
        const category = categoryDetails.find(
          (cat) => cat.id === item.fatsCategoryId
        );
        return {
          categoryId: item.fatsCategoryId,
          count: item._count,
          category: category || {
            id: item.fatsCategoryId,
            mainCategoryDesc: "Unknown",
            subCategoryDesc: "Unknown",
          },
        };
      });

      const stats = {
        total: totalCount,
        verified: verifiedCount,
        unverified: totalCount - verifiedCount,
        generated: generatedCount,
        notGenerated: totalCount - generatedCount,
        byLocation: locationStats,
        byCategory: categoryStats,
      };

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset capture stats retrieved successfully",
            stats
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async getAssetVerificationStats(req, res, next) {
    try {
      // Get total count
      const totalCount = await prisma.assetVerification.count();

      // Get counts by asset condition
      const countByCondition = await prisma.assetVerification.groupBy({
        by: ["assetCondition"],
        _count: true,
      });

      // Get counts by asset status
      const countByStatus = await prisma.assetVerification.groupBy({
        by: ["assetStatus"],
        _count: true,
      });

      const stats = {
        total: totalCount,
        byCondition: countByCondition.map((item) => ({
          condition: item.assetCondition || "Not Specified",
          count: item._count,
        })),
        byStatus: countByStatus.map((item) => ({
          status: item.assetStatus || "Not Specified",
          count: item._count,
        })),
      };

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "Asset verification stats retrieved successfully",
            stats
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async getLocationStats(req, res, next) {
    try {
      // Get total count
      const totalCount = await prisma.location.count();

      // Get counts by company
      const countByCompany = await prisma.location.groupBy({
        by: ["company"],
        _count: true,
      });

      // Get counts by building
      const countByBuilding = await prisma.location.groupBy({
        by: ["building"],
        _count: true,
      });

      // Get counts by level/floor
      const countByFloor = await prisma.location.groupBy({
        by: ["levelFloor"],
        _count: true,
      });

      const stats = {
        total: totalCount,
        byCompany: countByCompany.map((item) => ({
          company: item.company || "Not Specified",
          count: item._count,
        })),
        byBuilding: countByBuilding.map((item) => ({
          building: item.building || "Not Specified",
          count: item._count,
        })),
        byFloor: countByFloor.map((item) => ({
          floor: item.levelFloor || "Not Specified",
          count: item._count,
        })),
      };

      res
        .status(200)
        .json(
          response(200, true, "Location stats retrieved successfully", stats)
        );
    } catch (error) {
      next(error);
    }
  }

  static async getFatsCategoryStats(req, res, next) {
    try {
      // Get total count
      const totalCount = await prisma.fatsCategory.count();

      // Get counts by main category
      const countByMainCategory = await prisma.fatsCategory.groupBy({
        by: ["mainCategoryDesc"],
        _count: true,
      });

      // Get asset counts for each category
      const categoriesWithAssetCounts = await prisma.fatsCategory.findMany({
        select: {
          id: true,
          mainCategoryDesc: true,
          subCategoryDesc: true,
          _count: {
            select: {
              assetCaptures: true,
            },
          },
        },
      });

      const stats = {
        total: totalCount,
        byMainCategory: countByMainCategory.map((item) => ({
          mainCategory: item.mainCategoryDesc || "Not Specified",
          count: item._count,
        })),
        categoriesWithAssets: categoriesWithAssetCounts.map((item) => ({
          id: item.id,
          mainCategory: item.mainCategoryDesc,
          subCategory: item.subCategoryDesc,
          assetCount: item._count.assetCaptures,
        })),
      };

      res
        .status(200)
        .json(
          response(
            200,
            true,
            "FATS category stats retrieved successfully",
            stats
          )
        );
    } catch (error) {
      next(error);
    }
  }
}

export default FatsStatsController;
