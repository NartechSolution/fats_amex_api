import express from "express";

import InventoryController from "../controllers/inventory.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = express.Router();

// Create inventory transaction
router.post("/", verifyAccessToken, InventoryController.create);

// Get all inventories with pagination
router.get("/", verifyAccessToken, InventoryController.getAll);

// Get verified assets by inventory ID
router.get(
  "/:id/verified-assets",
  verifyAccessToken,
  InventoryController.getVerifiedAssetsByInventoryId
);

// Add verified assets to inventory
router.post(
  "/add-verified-assets",
  verifyAccessToken,
  InventoryController.addVerifiedAssets
);

export default router;
