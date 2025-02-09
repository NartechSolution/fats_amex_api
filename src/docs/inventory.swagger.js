/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - assetLocation
 *         - mainCatCode
 *         - mainCatDesc
 *         - mainDesc
 *         - subCatCode
 *         - subCatDesc
 *         - assetCategory
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         assetLocation:
 *           type: string
 *         mainCatCode:
 *           type: string
 *         mainCatDesc:
 *           type: string
 *         mainDesc:
 *           type: string
 *         subCatCode:
 *           type: string
 *         subCatDesc:
 *           type: string
 *         assetCategory:
 *           type: string
 *         image:
 *           type: string
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         serial:
 *           type: string
 *         employeeId:
 *           type: string
 *         extNumber:
 *           type: string
 *         faNumber:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /api/v1/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               assetLocation:
 *                 type: string
 *               mainCatCode:
 *                 type: string
 *               mainCatDesc:
 *                 type: string
 *               mainDesc:
 *                 type: string
 *               subCatCode:
 *                 type: string
 *               subCatDesc:
 *                 type: string
 *               assetCategory:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               serial:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               extNumber:
 *                 type: string
 *               faNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inventory item created successfully
 *       400:
 *         description: Invalid input data
 *
 *   get:
 *     summary: Get all inventory items with pagination and search
 *     tags: [Inventory]
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
 *         description: List of inventory items retrieved successfully
 *
 * /api/v1/inventory/{id}:
 *   get:
 *     summary: Get inventory item by ID
 *     tags: [Inventory]
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
 *         description: Inventory item details
 *       404:
 *         description: Inventory item not found
 *
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               assetLocation:
 *                 type: string
 *               mainCatCode:
 *                 type: string
 *               mainCatDesc:
 *                 type: string
 *               mainDesc:
 *                 type: string
 *               subCatCode:
 *                 type: string
 *               subCatDesc:
 *                 type: string
 *               assetCategory:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               serial:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               extNumber:
 *                 type: string
 *               faNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *       404:
 *         description: Inventory item not found
 *
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
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
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 */
