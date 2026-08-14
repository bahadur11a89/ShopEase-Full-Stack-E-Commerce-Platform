const express = require('express')
const router = express.Router()

// Cart is managed on frontend via localStorage
// This route provides cart summary/validation
router.post('/validate', (req, res) => {
    const { items } = req.body
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' })
    const total = items.reduce((acc, item) => acc + item.price * item.qty, 0)
    res.json({ valid: true, total, itemCount: items.length })
})

module.exports = router
