const express = require('express');
const controller = require('../controllers/user.controller');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware(true), controller.me.bind(controller));

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: List all users (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List users
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware(true), authorizeRoles('admin'), controller.list.bind(controller));

module.exports = router;
