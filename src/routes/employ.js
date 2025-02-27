import express from "express";
import EmployeeController from "../controllers/employ.js";

const router = express.Router();

router.post("/", EmployeeController.create);
router.post("/bulk", EmployeeController.bulkCreate);
router.get("/", EmployeeController.getAll);
router.get("/:id", EmployeeController.getById);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);

export default router;
