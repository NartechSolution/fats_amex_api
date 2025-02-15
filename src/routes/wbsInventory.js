import express from "express";
import { uploadSingle } from "multermate-es";
import WbsInventoryController from "../controllers/wbsInventory.js";
import { ensureDir } from "../utils/file.js";

const router = express.Router();
const upload = uploadSingle({
  destination: "uploads/wbs-inventory",
  filename: "image",
});

const ensureUpload = async (req, res, next) => {
  await ensureDir("uploads/wbs-inventory");
  next();
};

router.post("/", ensureUpload, upload, WbsInventoryController.create);
router.get("/", WbsInventoryController.getAll);
router.get("/export-excel", WbsInventoryController.exportExcel);
router.get("/:id", WbsInventoryController.getById);
router.put("/:id", ensureUpload, upload, WbsInventoryController.update);
router.delete("/:id", WbsInventoryController.delete);

export default router;
