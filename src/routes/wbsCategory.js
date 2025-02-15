import express from "express";
import { uploadSingle } from "multermate-es";
import WbsCategoryController from "../controllers/wbsCategory.js";
import { ensureDir } from "../utils/file.js";

const router = express.Router();
const upload = uploadSingle({
  destination: "uploads/wbs-category",
  filename: "image",
});

const ensureUpload = async (req, res, next) => {
  await ensureDir("uploads/wbs-category");
  next();
};

router.post("/", ensureUpload, upload, WbsCategoryController.create);
router.get("/", WbsCategoryController.getAll);
router.get("/export/excel", WbsCategoryController.exportExcel);
router.get("/:id", WbsCategoryController.getById);
router.put("/:id", ensureUpload, upload, WbsCategoryController.update);
router.delete("/:id", WbsCategoryController.delete);

export default router;
