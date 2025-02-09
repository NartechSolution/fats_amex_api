import express from "express";

import inventoryRoutes from "./routes/inventory.js";
import roleRoutes from "./routes/role.js";
import userRoutes from "./routes/user.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/roles", roleRoutes);
router.use("/inventory", inventoryRoutes);

export default router;
