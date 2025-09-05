const express = require('express');
const controller = require('../controllers/order.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order processing and tracking
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: List orders (admin lists all, user lists own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, completed, cancelled]
 *     responses:
 *       200:
 *         description: Orders list
 */
router.get('/', authMiddleware(true), controller.list.bind(controller));

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [menuItemId, quantity]
 *                   properties:
 *                     menuItemId: { type: string }
 *                     quantity: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authMiddleware(true), controller.create.bind(controller));

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID (owner or admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.get('/:id', authMiddleware(true), controller.get.bind(controller));

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin; users can cancel their pending order)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, out_for_delivery, completed, cancelled]
 *     responses:
 *       200:
 *         description: Updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch('/:id/status', authMiddleware(true), controller.updateStatus.bind(controller));

module.exports = router;
