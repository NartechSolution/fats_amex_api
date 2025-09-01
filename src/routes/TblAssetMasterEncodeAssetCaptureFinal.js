import express from "express";
import { uploadSingle } from "multermate";
import controller from "../controllers/TblAssetMasterEncodeAssetCaptureFinal.js";
import { ensureDir } from "../utils/file.js";

const router = express.Router();
const upload = uploadSingle({
  destination: "uploads/asset-master",
  filename: "image",
});

const ensureUpload = async (req, res, next) => {
  await ensureDir("uploads/asset-master");
  next();
};

// router.use(verifyAccessToken);

router.post("/", ensureUpload, upload, controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", ensureUpload, upload, controller.update);
router.delete("/:id", controller.delete);

export default router;
