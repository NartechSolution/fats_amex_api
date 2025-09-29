import express from "express";
import GatePassController from "../controllers/gatePass.js";

const router = express.Router();

// Main GatePass CRUD routes
router.post("/", GatePassController.create);
router.get("/", GatePassController.getAll);
router.get("/:id", GatePassController.getById);
router.put("/:id", GatePassController.update);
router.delete("/:id", GatePassController.delete);

// GatePass Detail routes
router.post("/details", GatePassController.createDetail);
router.get("/:gatePassId/details", GatePassController.getDetailsByGatePassId);
router.put("/details/:id", GatePassController.updateDetail);
router.delete("/details/:id", GatePassController.deleteDetail);

export default router;
