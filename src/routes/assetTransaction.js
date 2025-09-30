import express from "express";
import AssetTransactionController from "../controllers/assetTransaction.js";

const router = express.Router();

// CRUD operations
router.post("/", AssetTransactionController.create);
router.get("/", AssetTransactionController.getAll);
router.get("/:id", AssetTransactionController.getById);
router.put("/:id", AssetTransactionController.update);
router.delete("/:id", AssetTransactionController.delete);

// Additional route for filtering by transaction type
router.get("/type/:type", AssetTransactionController.getByType);

export default router;
