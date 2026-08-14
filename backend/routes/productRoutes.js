const express = require('express')
const router = express.Router()
const { getAllProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, seedProducts, addReview } = require('../controllers/productController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/featured', getFeaturedProducts)
router.get('/seed', seedProducts)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', protect, adminOnly, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)
router.post('/:id/review', protect, addReview)

module.exports = router
