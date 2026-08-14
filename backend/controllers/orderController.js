const mongoose = require('mongoose')
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')

const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, couponCode } = req.body
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' })
        }

        // 1. Extract valid product IDs to query DB
        const productIds = []
        for (const rawItem of items) {
            const prodId = rawItem.product || rawItem._id || rawItem.id
            if (prodId && mongoose.Types.ObjectId.isValid(String(prodId))) {
                productIds.push(String(prodId))
            }
        }

        // 2. Fetch matching products from MongoDB
        const dbProducts = await Product.find({ _id: { $in: productIds } })
        const dbProductMap = new Map()
        dbProducts.forEach(p => dbProductMap.set(String(p._id), p))

        // 3. Process each item (fallback to client item info if DB product was re-seeded)
        const orderItems = []
        let subtotal = 0

        for (const rawItem of items) {
            const prodId = String(rawItem.product || rawItem._id || rawItem.id || '')
            const qty = Math.max(1, Number(rawItem.qty) || 1)
            const dbProd = dbProductMap.get(prodId)

            let itemPrice = Number(rawItem.price) || 0
            let itemName = rawItem.name || 'Product Item'
            let itemImage = rawItem.image || ''
            let validProdId = null

            if (dbProd) {
                itemPrice = dbProd.price
                itemName = dbProd.name
                itemImage = dbProd.image
                validProdId = dbProd._id
                // Safely decrement stock if available
                if (dbProd.stock > 0) {
                    await Product.updateOne({ _id: dbProd._id }, { $inc: { stock: -qty } }).catch(() => {})
                }
            } else if (mongoose.Types.ObjectId.isValid(prodId)) {
                validProdId = prodId
            } else {
                validProdId = new mongoose.Types.ObjectId()
            }

            subtotal += itemPrice * qty

            orderItems.push({
                product: validProdId,
                name: itemName,
                image: itemImage,
                price: itemPrice,
                qty
            })
        }

        // 4. Calculate Final Total
        const coupons = { 'SAVE10': 10, 'SHOPEASE20': 20, 'FIRST50': 50 }
        const shipping = subtotal >= 499 ? 0 : 49
        let discountPct = 0
        if (couponCode && typeof couponCode === 'string') {
            const cleanCode = couponCode.trim().toUpperCase()
            if (coupons[cleanCode]) discountPct = coupons[cleanCode]
        }
        const discountAmt = Math.round((subtotal * discountPct) / 100)
        const calculatedTotalPrice = subtotal + shipping - discountAmt

        // 5. Create & Save Order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress: shippingAddress || {},
            paymentMethod: paymentMethod || 'COD',
            totalPrice: calculatedTotalPrice
        })

        return res.status(201).json(order)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.json(orders)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const { status, search, page, limit = 10 } = req.query
        let query = {}

        if (status && status !== 'All') query.status = status

        if (search) {
            const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            const matchingUsers = await User.find({
                $or: [{ name: searchRegex }, { email: searchRegex }]
            }).select('_id')
            const userIds = matchingUsers.map(u => u._id)

            const isObjectId = /^[0-9a-fA-F]{24}$/.test(search)
            if (isObjectId) {
                query._id = search
            } else {
                query.$or = [
                    { user: { $in: userIds } },
                    { 'shippingAddress.name': searchRegex },
                    { 'shippingAddress.city': searchRegex }
                ]
            }
        }

        const total = await Order.countDocuments(query)

        // If page param is specified, return paginated object
        if (page) {
            const pageNum = Number(page) || 1
            const orders = await Order.find(query)
                .populate('user', 'name email phone')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((pageNum - 1) * limit)

            return res.json({ orders, total, pages: Math.ceil(total / limit), page: pageNum })
        }

        // Default legacy fallback: return orders array
        const orders = await Order.find(query).populate('user', 'name email phone').sort({ createdAt: -1 })
        res.json(orders)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        if (!order) return res.status(404).json({ message: 'Order not found' })
        res.json(order)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getOrderStats = async (req, res) => {
    try {
        const total = await Order.countDocuments()
        const revenue = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ])
        res.json({ total, revenue: revenue[0]?.total || 0 })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderStats }
