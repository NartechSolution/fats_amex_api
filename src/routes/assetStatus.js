import express from "express";
import AssetStatusController from "../controllers/assetStatus.js";

const router = express.Router();

router.post("/", AssetStatusController.create);
router.get("/", AssetStatusController.getAll);
router.get("/:id", AssetStatusController.getById);
router.put("/:id", AssetStatusController.update);
router.delete("/:id", AssetStatusController.delete);

export default router;
