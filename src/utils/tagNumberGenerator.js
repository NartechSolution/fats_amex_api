import prisma from "./prismaClient.js";

export async function generateTagNumbers(fatsCategoryId, quantity) {
  // Get the category details to get the codes
  const fatsCategory = await prisma.fatsCategory.findUnique({
    where: { id: fatsCategoryId },
  });

  if (!fatsCategory) {
    throw new Error("Category not found");
  }

  if (!fatsCategory.mainCatCode || !fatsCategory.subCategoryCode) {
    throw new Error("Category is missing required codes");
  }

  const categoryPrefix = `${fatsCategory.mainCatCode}${fatsCategory.subCategoryCode}`;

  // Get the latest tag number for this category
  const latestAssetTag = await prisma.assetTag.findFirst({
    where: {
      tagNumber: {
        startsWith: categoryPrefix,
      },
    },
    orderBy: {
      tagNumber: "desc",
    },
  });

  let lastNumber = 100000;
  if (latestAssetTag) {
    // Extract the number part from the latest tag
    const numberPart = parseInt(latestAssetTag.tagNumber.slice(-6));
    lastNumber = numberPart;
  }

  // Generate new tag numbers
  const tagNumbers = [];
  for (let i = 0; i < quantity; i++) {
    const newNumber = lastNumber + i + 1;
    const tagNumber = `${categoryPrefix}${newNumber
      .toString()
      .padStart(6, "0")}`;
    tagNumbers.push(tagNumber);
  }

  return tagNumbers;
}
