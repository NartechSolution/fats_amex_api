import express from "express";
import DepartmentController from "../controllers/department.js";

const router = express.Router();

router.post("/", DepartmentController.create);
router.post("/bulk", DepartmentController.bulkCreate);
router.get("/", DepartmentController.getAll);
router.get("/export/excel", DepartmentController.exportExcel);
router.get("/:id", DepartmentController.getById);
router.put("/:id", DepartmentController.update);
router.delete("/:id", DepartmentController.delete);

export default router;
