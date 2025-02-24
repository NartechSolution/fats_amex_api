import express from "express";
import BrandController from "../controllers/brand.js";

const router = express.Router();

router.post("/", BrandController.create);
router.get("/", BrandController.getAll);
router.get("/:id", BrandController.getById);
router.put("/:id", BrandController.update);
router.delete("/:id", BrandController.delete);

export default router;
