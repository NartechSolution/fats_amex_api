import express from "express";
import { uploadSingle } from "multermate-es";
import InventoryController from "../controllers/inventory.js";
import { ensureDir } from "../utils/file.js";

const router = express.Router();
const upload = uploadSingle({
  destination: "uploads/inventory",
  filename: "image",
});

const ensureUpload = (req, res, next) => {
  ensureDir("uploads/inventory");
  next();
};
// router.use(verifyAccessToken);

router.post("/", ensureUpload, upload, InventoryController.create);
router.get("/", InventoryController.getAll);
router.get("/:id", InventoryController.getById);
router.put("/:id", ensureUpload, upload, InventoryController.update);
router.delete("/:id", InventoryController.delete);

export default router;
