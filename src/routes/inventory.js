import express from "express";

import InventoryController from "../controllers/inventory.js";
import { verifyAccessToken } from "../middlewares/auth.js";

const router = express.Router();

// Create inventory transaction (no file upload needed)
router.post("/", verifyAccessToken, InventoryController.create);

export default router;
