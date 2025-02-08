import express from "express";

import roleRoutes from "./routes/role.js";
import userRoutes from "./routes/user.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/roles", roleRoutes);

export default router;
