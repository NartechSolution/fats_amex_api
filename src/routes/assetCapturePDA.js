import { Router } from "express";
import AssetCapturePDAController from "../controllers/assetCapturePDA.js";

const router = Router();

// POST /api/asset-capture-pda - Create a new Asset Capture PDA
router.post("/", AssetCapturePDAController.create);

// GET /api/asset-capture-pda - Get all Asset Captures PDA with pagination and search
router.get("/", AssetCapturePDAController.getAll);

// GET /api/asset-capture-pda/:id - Get Asset Capture PDA by ID
router.get("/:id", AssetCapturePDAController.getById);

// PUT /api/asset-capture-pda/:id - Update Asset Capture PDA by ID
router.put("/:id", AssetCapturePDAController.update);

// DELETE /api/asset-capture-pda/:id - Delete Asset Capture PDA by ID
router.delete("/:id", AssetCapturePDAController.delete);

export default router;
