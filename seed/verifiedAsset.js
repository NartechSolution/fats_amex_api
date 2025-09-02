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

// Helper function to generate random images array
function generateImagesArray() {
  const numImages = randomInt(1, 4);
  const images = [];
  const extensions = ["jpg", "png", "jpeg"];

  for (let i = 0; i < numImages; i++) {
    images.push({
      id: nanoid(12),
      path: `/uploads/verified-asset/asset-${nanoid(8)}.${randomChoice(
        extensions
      )}`,
    });
  }

  return JSON.stringify(images);
}

// Helper function to generate random date in the past
function randomPastDate(yearsBack = 2) {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000
  );
  return pastDate.toISOString().split("T")[0];
}

// Helper function to generate current time
function getCurrentTime() {
  return new Date().toTimeString().split(" ")[0];
}

// Helper function to generate realistic asset data
function generateAssetData() {
  const categories = [
    { major: "Electronics", minor: "Laptop" },
    { major: "Electronics", minor: "Desktop" },
    { major: "Electronics", minor: "Monitor" },
    { major: "Electronics", minor: "Printer" },
    { major: "Furniture", minor: "Desk" },
    { major: "Furniture", minor: "Chair" },
    { major: "Furniture", minor: "Cabinet" },
    { major: "Equipment", minor: "Server" },
    { major: "Equipment", minor: "Network Device" },
    { major: "Vehicle", minor: "Car" },
    { major: "Vehicle", minor: "Truck" },
    { major: "Tools", minor: "Software License" },
  ];

  const conditions = [
    "New",
    "Good",
    "Fair",
    "Poor",
    "Excellent",
    "Under Repair",
  ];
  const assetTypes = [
    "Hardware",
    "Software",
    "Furniture",
    "Vehicle",
    "Equipment",
  ];
  const countries = [
    "USA",
    "Canada",
    "UK",
    "Germany",
    "France",
    "Australia",
    "Japan",
  ];
  const manufacturers = [
    "Dell",
    "HP",
    "Lenovo",
    "Apple",
    "Microsoft",
    "Samsung",
    "LG",
    "Canon",
    "Xerox",
  ];
  const ownershipTypes = ["Company", "Leased", "Rented", "Personal"];
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
  ];
  const states = [
    "California",
    "Texas",
    "Florida",
    "New York",
    "Pennsylvania",
    "Illinois",
    "Ohio",
    "Georgia",
  ];
  const companyNames = [
    "TechCorp",
    "GlobalSoft",
    "InnovateTech",
    "DataSystems",
    "CloudCompany",
    "NextGen Solutions",
  ];
  const productNames = [
    "ProBook 450",
    "ThinkPad X1",
    "OptiPlex 7000",
    "LaserJet Pro",
    "UltraWide Monitor",
    "Executive Chair",
  ];

  const category = randomChoice(categories);
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = getCurrentTime();

  return {
    majorCategory: category.major,
    majorCategoryDescription: `${category.major} related assets`,
    minorCategory: category.minor,
    minorCategoryDescription: `${category.minor} equipment`,
    tagNumber: `TAG${randomString(6)}`,
    serialNumber: `SN${randomString(8)}`,
    assetDescription: randomChoice(productNames),
    assetType: randomChoice(assetTypes),
    assetCondition: randomChoice(conditions),
    country: randomChoice(countries),
    region: randomChoice(states),
    cityName: randomChoice(cities),
    dao: `DAO${randomString(3)}`,
    daoName: `${randomChoice(companyNames)} Department`,
    businessUnit: `BU${randomString(3)}`,
    buildingNo: `B${randomString(3)}`,
    floorNo: `F${randomInt(1, 20)}`,
    employeeId: `EMP${randomString(5)}`,
    poNumber: `PO${randomString(6)}`,
    poDate: randomPastDate(2),
    deliveryNoteNo: `DN${randomString(6)}`,
    supplier: randomChoice(companyNames),
    invoiceNo: `INV${randomString(6)}`,
    invoiceDate: randomPastDate(1),
    modelOfAsset: randomChoice(productNames),
    manufacturer: randomChoice(manufacturers),
    ownership: randomChoice(ownershipTypes),
    bought: randomPastDate(3),
    terminalId: `TERM${randomString(4)}`,
    atmNumber: `ATM${randomString(6)}`,
    locationTag: `LOC${randomString(4)}`,
    buildingName: `${randomChoice([
      "Main",
      "North",
      "South",
      "East",
      "West",
    ])} Building`,
    buildingAddress: `${randomInt(100, 9999)} ${randomChoice([
      "Main St",
      "Oak Ave",
      "Pine Rd",
      "Elm Dr",
      "Park Blvd",
    ])}`,
    userLoginId: `USER${randomString(5)}`,
    mainSubSeriesNo: randomInt(1, 1000),
    assetDateCaptured: currentDate,
    assetTimeCaptured: currentTime,
    assetDateScanned: currentDate,
    assetTimeScanned: currentTime,
    qty: randomInt(1, 10),
    phoneExtNo: randomString(4),
    fullLocationDetails: `${randomInt(100, 9999)} ${randomChoice([
      "Main St",
      "Oak Ave",
      "Pine Rd",
    ])}, ${randomChoice(cities)}, ${randomChoice(states)}`,
    journalRefNo: `JRN${randomString(6)}`,
    images: generateImagesArray(),
  };
}

async function seedVerifiedAssets() {
  try {
    console.log("🌱 Starting to seed VerifiedAsset data...");

    // Clear existing data
    console.log("🗑️ Clearing existing VerifiedAsset data...");
    await prisma.verifiedAsset.deleteMany();

    // Generate and insert 50 records
    console.log("📝 Generating 50 VerifiedAsset records...");
    const verifiedAssets = [];

    for (let i = 0; i < 50; i++) {
      verifiedAssets.push(generateAssetData());
    }

    // Insert all records
    console.log("💾 Inserting records into database...");
    await prisma.verifiedAsset.createMany({
      data: verifiedAssets,
    });

    console.log("✅ Successfully seeded 50 VerifiedAsset records!");

    // Display summary
    const count = await prisma.verifiedAsset.count();
    console.log(`📊 Total VerifiedAsset records in database: ${count}`);
  } catch (error) {
    console.error("❌ Error seeding VerifiedAsset data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedVerifiedAssets()
    .then(() => {
      console.log("🎉 Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export default seedVerifiedAssets;
