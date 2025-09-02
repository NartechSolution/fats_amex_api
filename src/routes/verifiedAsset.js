import express from "express";
import { uploadSingle } from "multermate-es";
import VerifiedAssetController from "../controllers/verifiedAsset.js";
import { ensureDir } from "../utils/file.js";

const router = express.Router();
const upload = uploadSingle({
  destination: "uploads/verified-asset",
  filename: "image",
});

const ensureUpload = async (req, res, next) => {
  await ensureDir("uploads/verified-asset");
  next();
};

// router.use(verifyAccessToken);

router.post("/", ensureUpload, upload, VerifiedAssetController.create);
router.get("/", VerifiedAssetController.getAll);
router.get("/:id", VerifiedAssetController.getById);
router.put("/:id", ensureUpload, upload, VerifiedAssetController.update);
router.delete("/:id", VerifiedAssetController.delete);

export default router;
