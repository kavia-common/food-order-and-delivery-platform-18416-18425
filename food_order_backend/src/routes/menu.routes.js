const express = require('express');
const controller = require('../controllers/menu.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Menu
 *     description: Menu item operations
 */

/**
 * @swagger
 * /api/v1/menu:
 *   get:
 *     summary: List menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Only available items
 *     responses:
 *       200:
 *         description: Menu list
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /api/v1/menu:
 *   post:
 *     summary: Create a menu item (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               isAvailable: { type: boolean }
 *     responses:
 *       201:
 *         description: Created
 *       403:
 *         description: Forbidden
 */
router.post('/', authMiddleware(true), authorizeRoles('admin'), controller.create.bind(controller));

/**
 * @swagger
 * /api/v1/menu/{id}:
 *   get:
 *     summary: Get a menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Menu item
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.get.bind(controller));

/**
 * @swagger
 * /api/v1/menu/{id}:
 *   put:
 *     summary: Update a menu item (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               isAvailable: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', authMiddleware(true), authorizeRoles('admin'), controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/menu/{id}:
 *   delete:
 *     summary: Delete a menu item (admin)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:id', authMiddleware(true), authorizeRoles('admin'), controller.remove.bind(controller));

module.exports = router;
