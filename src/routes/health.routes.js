const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check and monitoring
 */

/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Ping the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Returns pong message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pong
 */
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Full system health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-24T15:00:00.000Z
 *                 db:
 *                   type: string
 *                   enum: [connected, disconnected]
 *                   example: connected
 */
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date(),
    db: dbState === 1 ? 'connected' : 'disconnected',
  });
});

module.exports = router;
