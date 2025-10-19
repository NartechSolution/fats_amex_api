import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// Helper function to generate random choice from array
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random string
function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to generate random date in the past
function randomPastDate(yearsBack = 2) {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000
  );
  return pastDate;
}

// Helper function to generate random transaction date
function randomTransactionDate() {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000 // Within last year
  );
  return pastDate;
}

async function seedInventory() {
  try {
    console.log("🌱 Starting Inventory seeding...");

    // Clear existing data
    await prisma.inventory.deleteMany({});
    console.log("🗑️ Cleared existing Inventory data");

    const locations = [
      "Main Office",
      "Branch Office A",
      "Branch Office B",
      "Warehouse 1",
      "Warehouse 2",
      "IT Department",
      "HR Department",
      "Finance Department",
    ];

    const mainCategories = [
      { code: "ELEC", desc: "Electronics" },
      { code: "FURN", desc: "Furniture" },
      { code: "EQUIP", desc: "Equipment" },
      { code: "TOOL", desc: "Tools" },
      { code: "VEH", desc: "Vehicles" },
      { code: "SOFT", desc: "Software" },
    ];

    const subCategories = [
      { code: "COMP", desc: "Computers" },
      { code: "MON", desc: "Monitors" },
      { code: "PRINT", desc: "Printers" },
      { code: "DESK", desc: "Desks" },
      { code: "CHAIR", desc: "Chairs" },
      { code: "SERV", desc: "Servers" },
      { code: "NET", desc: "Network Equipment" },
      { code: "LIC", desc: "Licenses" },
    ];

    const assetTypes = [
      "Hardware",
      "Software",
      "Furniture",
      "Equipment",
      "Vehicle",
    ];

    const transactionNames = [
      "Purchase Order",
      "Asset Transfer",
      "Maintenance",
      "Disposal",
      "Upgrade",
      "New Acquisition",
      "Lease Agreement",
    ];

    const statuses = ["Created", "Completed"];

    const employees = [
      "EMP001",
      "EMP002",
      "EMP003",
      "EMP004",
      "EMP005",
      "EMP006",
      "EMP007",
      "EMP008",
      "EMP009",
      "EMP010",
    ];

    const createdByUsers = [
      "admin",
      "john.doe",
      "jane.smith",
      "mike.johnson",
      "sarah.wilson",
    ];

    const inventoryItems = [];

    // Generate 50 inventory records
    for (let i = 0; i < 50; i++) {
      const mainCat = randomChoice(mainCategories);
      const subCat = randomChoice(subCategories);
      const location = randomChoice(locations);
      const assetType = randomChoice(assetTypes);
      const transactionName = randomChoice(transactionNames);
      const status = randomChoice(statuses);

      const inventoryItem = {
        assetLocation: location,
        mainCatCode: mainCat.code,
        mainCatDesc: mainCat.desc,
        mainDesc: `${mainCat.desc} - ${subCat.desc}`,
        subCatCode: subCat.code,
        subCatDesc: subCat.desc,
        assetCategory: `${mainCat.code}-${subCat.code}`,
        image: `/uploads/inventory/item-${nanoid(8)}.jpg`,
        quantity: randomInt(1, 10),
        serial: `SN${randomString(8)}`,
        employeeId: randomChoice(employees),
        extNumber: `EXT${randomInt(100, 999)}`,
        faNumber: `FA${randomString(6)}`,
        type: assetType,
        transactionId: `TXN${randomString(10)}`,
        transactionDate: randomTransactionDate(),
        transactionName: transactionName,
        createdBy: randomChoice(createdByUsers),
        status: status,
      };

      inventoryItems.push(inventoryItem);
    }

    // Insert all records
    console.log("💾 Inserting inventory records into database...");
    await prisma.inventory.createMany({
      data: inventoryItems,
    });

    console.log("✅ Successfully seeded 50 Inventory records!");

    // Display summary
    const count = await prisma.inventory.count();
    console.log(`📊 Total Inventory records in database: ${count}`);

    // Display sample data
    const sampleRecords = await prisma.inventory.findMany({
      take: 3,
      select: {
        id: true,
        assetLocation: true,
        mainCatDesc: true,
        transactionName: true,
        status: true,
        createdBy: true,
      },
    });

    console.log("📋 Sample inventory records:");
    sampleRecords.forEach((record, index) => {
      console.log(
        `${index + 1}. ${record.assetLocation} - ${record.mainCatDesc} (${
          record.transactionName
        }) - ${record.status} by ${record.createdBy}`
      );
    });
  } catch (error) {
    console.error("❌ Error seeding Inventory data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedInventory()
    .then(() => {
      console.log("🎉 Inventory seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Inventory seeding failed:", error);
      process.exit(1);
    });
}

export default seedInventory;
