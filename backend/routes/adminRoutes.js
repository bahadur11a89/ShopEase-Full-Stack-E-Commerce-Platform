const express = require('express')
const router = express.Router()
const { getAdminStats, getAdminAnalytics, getLowStockProducts, getAdminActivity } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/stats', protect, adminOnly, getAdminStats)
router.get('/analytics', protect, adminOnly, getAdminAnalytics)
router.get('/low-stock', protect, adminOnly, getLowStockProducts)
router.get('/activity', protect, adminOnly, getAdminActivity)

module.exports = router
