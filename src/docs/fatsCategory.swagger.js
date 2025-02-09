/**
 * @swagger
 * components:
 *   schemas:
 *     FatsCategory:
 *       type: object
 *       required:
 *         - mainCatCode
 *         - mainCategoryDesc
 *         - mainDescription
 *         - subCategoryCode
 *         - subCategoryDesc
 *         - assetCategory
 *       properties:
 *         mainCatCode:
 *           type: string
 *           description: Main category code
 *         mainCategoryDesc:
 *           type: string
 *           description: Main category description
 *         mainDescription:
 *           type: string
 *           description: Main description
 *         subCategoryCode:
 *           type: string
 *           description: Sub category code
 *         subCategoryDesc:
 *           type: string
 *           description: Sub category description
 *
 * /api/v1/fats-category:
 *   post:
 *     summary: Create a new FATS category
 *     tags: [FATS Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FatsCategory'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Category with this code already exists
 *
 *   get:
 *     summary: Get all FATS categories with pagination and search
 *     tags: [FATS Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully
 *
 * /api/v1/fats-category/{id}:
 *   get:
 *     summary: Get FATS category by ID
 *     tags: [FATS Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *
 *   put:
 *     summary: Update FATS category
 *     tags: [FATS Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FatsCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category with this code already exists
 *
 *   delete:
 *     summary: Delete FATS category
 *     tags: [FATS Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
