import express from "express";

import fatsCategoryRoutes from "./routes/fatsCategory.js";
import inventoryRoutes from "./routes/inventory.js";
import roleRoutes from "./routes/role.js";
import userRoutes from "./routes/user.js";
import wbsCategoryRoutes from "./routes/wbsCategory.js";
import wbsModifierRoutes from "./routes/wbsModifiers.js";
import wbsInventoryRoutes from "./routes/wbsInventory.js";
import assetCaptureRoutes from "./routes/assetCapture.js";
import locationRoutes from "./routes/location.js";
const router = express.Router();

router.use("/user", userRoutes);
router.use("/roles", roleRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/fats-category", fatsCategoryRoutes);
router.use("/wbs-category", wbsCategoryRoutes);
router.use("/wbs-modifier", wbsModifierRoutes);
router.use("/wbs-inventory", wbsInventoryRoutes);
router.use("/location", locationRoutes);
router.use("/asset-capture", assetCaptureRoutes);

export default router;
