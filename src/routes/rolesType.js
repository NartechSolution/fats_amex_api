import express from "express";
import RolesTypeController from "../controllers/rolesType.js";

const router = express.Router();

router.post("/", RolesTypeController.create);
router.get("/", RolesTypeController.getAll);
router.get("/:id", RolesTypeController.getById);
router.put("/:id", RolesTypeController.update);
router.delete("/:id", RolesTypeController.delete);

export default router;
