import express from "express";
import AssetTagsController from "../controllers/assetTags.js";

const router = express.Router();

router.post("/generate", AssetTagsController.generate);
router.get("/", AssetTagsController.getAll);
router.get("/:id", AssetTagsController.getById);
router.delete("/:assetTagId", AssetTagsController.delete);

export default router;
