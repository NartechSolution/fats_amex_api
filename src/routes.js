import express from "express";

import assetCaptureRoutes from "./routes/assetCapture.js";
import assetConditionRoutes from "./routes/assetCondition.js";
import assetStatusRoutes from "./routes/assetStatus.js";
import assetTagsRoutes from "./routes/assetTags.js";
import assetVerificationRoutes from "./routes/assetVerification.js";
import brandRoutes from "./routes/brand.js";
import departmentRoutes from "./routes/department.js";
import employRoutes from "./routes/employ.js";
import fatsCategoryRoutes from "./routes/fatsCategory.js";
import fatsStatsRoutes from "./routes/fatsStats.js";
import inventoryRoutes from "./routes/inventory.js";
import locationRoutes from "./routes/location.js";
import roleRoutes from "./routes/role.js";
import rolesTypeRoutes from "./routes/rolesType.js";
import tblAssetMasterEncodeAssetCaptureFinalRoutes from "./routes/TblAssetMasterEncodeAssetCaptureFinal.js";
import userRoutes from "./routes/user.js";
import wbsCategoryRoutes from "./routes/wbsCategory.js";
import wbsInventoryRoutes from "./routes/wbsInventory.js";
import wbsModifierRoutes from "./routes/wbsModifiers.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/roles", roleRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/fats-category", fatsCategoryRoutes);
router.use("/wbs-category", wbsCategoryRoutes);
router.use("/wbs-modifier", wbsModifierRoutes);
router.use("/wbs-inventory", wbsInventoryRoutes);
router.use("/location", locationRoutes);
router.use("/fats-stats", fatsStatsRoutes);
router.use("/asset-capture", assetCaptureRoutes);
router.use("/asset-tags", assetTagsRoutes);
router.use("/brand", brandRoutes);
router.use("/asset-condition", assetConditionRoutes);
router.use("/asset-status", assetStatusRoutes);
router.use("/department", departmentRoutes);
router.use("/roles-type", rolesTypeRoutes);
router.use("/employee", employRoutes);
router.use("/asset-verification", assetVerificationRoutes);
router.use("/asset-master-encode", tblAssetMasterEncodeAssetCaptureFinalRoutes);

export default router;
