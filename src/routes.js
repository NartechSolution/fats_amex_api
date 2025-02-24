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
import assetTagsRoutes from "./routes/assetTags.js";
import brandRoutes from "./routes/brand.js";
import assetConditionRoutes from "./routes/assetCondition.js";
import assetStatusRoutes from "./routes/assetStatus.js";
import departmentRoutes from "./routes/department.js";
import rolesTypeRoutes from "./routes/rolesType.js";
import employRoutes from "./routes/employ.js";
import assetVerificationRoutes from "./routes/assetVerification.js";

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
router.use("/asset-tags", assetTagsRoutes);
router.use("/brand", brandRoutes);
router.use("/asset-condition", assetConditionRoutes);
router.use("/asset-status", assetStatusRoutes);
router.use("/department", departmentRoutes);
router.use("/roles-type", rolesTypeRoutes);
router.use("/employee", employRoutes);
router.use("/asset-verification", assetVerificationRoutes);

export default router;
