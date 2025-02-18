import express from "express";
import AssetCaptureController from "../controllers/assetCapture.js";

const router = express.Router();

router.post("/", AssetCaptureController.create);
router.get("/", AssetCaptureController.getAll);
router.get("/generated", AssetCaptureController.getGenerated);
router.get("/not-generated", AssetCaptureController.getNotGenerated);
router.get("/:id", AssetCaptureController.getById);
router.put("/:id", AssetCaptureController.update);
router.delete("/:id", AssetCaptureController.delete);

export default router;
