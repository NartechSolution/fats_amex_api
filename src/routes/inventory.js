import express from "express";
import { uploadSingle } from "multermate-es";
import InventoryController from "../controllers/inventory.js";
const router = express.Router();
const upload = uploadSingle({
  destination: "uploads/inventory",
  filename: "image",
});

// router.use(verifyAccessToken);

router.post("/", upload, InventoryController.create);
router.get("/", InventoryController.getAll);
router.get("/:id", InventoryController.getById);
router.put("/:id", upload, InventoryController.update);
router.delete("/:id", InventoryController.delete);

export default router;
