import express from "express";
import AssetConditionController from "../controllers/assetCondition.js";

const router = express.Router();

router.post("/", AssetConditionController.create);
router.get("/", AssetConditionController.getAll);
router.get("/:id", AssetConditionController.getById);
router.put("/:id", AssetConditionController.update);
router.delete("/:id", AssetConditionController.delete);

export default router;
