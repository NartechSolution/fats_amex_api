import seedInventory from "./inventory.js";
import seedVerifiedAssets from "./verifiedAsset.js";

async function main() {
  console.log("🚀 Starting database seeding...");

  try {
    // Seed VerifiedAssets
    await seedVerifiedAssets();

    // Seed Inventory
    await seedInventory();

    console.log("🎉 All seeding completed successfully!");
  } catch (error) {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  }
}

main();
