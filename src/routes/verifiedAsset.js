import express from "express";
import { uploadMultiple, uploadSingle } from "multermate-es";
import VerifiedAssetController from "../controllers/verifiedAsset.js";
import { ensureDir } from "../utils/file.js";

const router = express.Router();

// Single file upload for backward compatibility
const uploadSingleFile = uploadSingle({
  destination: "uploads/verified-asset",
  filename: "image",
});

// Multiple files upload for images
const uploadMultipleFiles = uploadMultiple({
  destination: "uploads/verified-asset",
  filename: "images",
  maxCount: 5, // Allow up to 5 images
});

const ensureUpload = async (req, res, next) => {
  await ensureDir("uploads/verified-asset");
  next();
};

// router.use(verifyAccessToken);

router.post(
  "/",
  ensureUpload,
  uploadMultipleFiles,
  VerifiedAssetController.create
);
router.get("/", VerifiedAssetController.getAll);
router.get("/:id", VerifiedAssetController.getById);
router.put(
  "/:id",
  ensureUpload,
  uploadSingleFile,
  VerifiedAssetController.update
);
router.delete("/:id", VerifiedAssetController.delete);

export default router;
