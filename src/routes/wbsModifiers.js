import express from "express";
import WbsModifierController from "../controllers/wbsModifiers.js";

const router = express.Router();

router.post("/", WbsModifierController.create);
router.get("/", WbsModifierController.getAll);
router.get("/:id", WbsModifierController.getById);
router.put("/:id", WbsModifierController.update);
router.delete("/:id", WbsModifierController.delete);

export default router;
