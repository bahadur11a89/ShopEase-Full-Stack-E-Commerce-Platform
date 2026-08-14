const express = require('express')
const router = express.Router()
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderStats } = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.post('/', protect, createOrder)
router.get('/myorders', protect, getMyOrders)
router.get('/all', protect, adminOnly, getAllOrders)
router.get('/stats', protect, adminOnly, getOrderStats)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

module.exports = router
