import express from "express";
import FatsStatsController from "../controllers/fatsStatsController.js";

const router = express.Router();

// Get overall stats for all entities
router.get("/overall", FatsStatsController.getOverallStats);

// Get asset capture stats
router.get("/asset-capture", FatsStatsController.getAssetCaptureStats);

// Get asset verification stats
router.get(
  "/asset-verification",
  FatsStatsController.getAssetVerificationStats
);

// Get location stats
router.get("/location", FatsStatsController.getLocationStats);

// Get FATS category stats
router.get("/fats-category", FatsStatsController.getFatsCategoryStats);

export default router;
