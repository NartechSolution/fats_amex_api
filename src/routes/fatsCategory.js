import express from "express";
import FatsCategoryController from "../controllers/fatsCategory.js";

const router = express.Router();

// router.use(verifyAccessToken);

router.post("/", FatsCategoryController.create);
router.get("/", FatsCategoryController.getAll);
router.get("/:id", FatsCategoryController.getById);
router.put("/:id", FatsCategoryController.update);
router.delete("/:id", FatsCategoryController.delete);

export default router;
