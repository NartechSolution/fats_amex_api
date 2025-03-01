import express from "express";
import { uploadMultiple } from "multermate-es";
import AssetVerificationController from "../controllers/assetVerification.js";
import { ensureDir } from "../utils/file.js";

const router = express.Router();

// Configure multiple image upload for 5 images
const upload = uploadMultiple({
  destination: "uploads/asset-verification",
  fields: [
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ],
});

const ensureUpload = async (req, res, next) => {
  await ensureDir("uploads/asset-verification");
  next();
};

router.post("/", ensureUpload, upload, AssetVerificationController.create);
router.get("/", AssetVerificationController.getAll);
router.get("/export/excel", AssetVerificationController.exportExcel);
router.get("/:id", AssetVerificationController.getById);
router.put("/:id", ensureUpload, upload, AssetVerificationController.update);
router.delete("/:id", AssetVerificationController.delete);

export default router;
