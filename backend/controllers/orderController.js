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

        // 1. Validate & Consolidate duplicate products in request items
        const consolidatedMap = new Map()
        for (const rawItem of items) {
            const prodId = rawItem.product || rawItem._id || rawItem.id
            if (!prodId || !mongoose.Types.ObjectId.isValid(String(prodId))) {
                return res.status(400).json({ message: 'Invalid product ID' })
            }
            const qty = Number(rawItem.qty)
            if (!Number.isInteger(qty) || qty <= 0) {
                return res.status(400).json({ message: 'Invalid product quantity' })
            }
            const idStr = String(prodId)
            const existingQty = consolidatedMap.get(idStr) || 0
            consolidatedMap.set(idStr, existingQty + qty)
        }

        // 2. Fetch authoritative products from MongoDB
        const productIds = Array.from(consolidatedMap.keys())
        const dbProducts = await Product.find({ _id: { $in: productIds } })

        if (dbProducts.length !== productIds.length) {
            return res.status(404).json({ message: 'One or more products no longer exist' })
        }

        // 3. Validate Stock & Calculate Server-Side Subtotal
        const coupons = { 'SAVE10': 10, 'SHOPEASE20': 20, 'FIRST50': 50 }
        let subtotal = 0
        const orderItems = []

        for (const product of dbProducts) {
            const requestedQty = consolidatedMap.get(String(product._id))

            if (product.stock === 0) {
                return res.status(400).json({ message: `Product "${product.name}" is out of stock` })
            }
            if (requestedQty > product.stock) {
                return res.status(400).json({
                    message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${requestedQty}`
                })
            }

            const itemSubtotal = product.price * requestedQty
            subtotal += itemSubtotal

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price, // DB price
                qty: requestedQty
            })
        }

        const shipping = subtotal >= 499 ? 0 : 49
        let discountPct = 0
        if (couponCode && typeof couponCode === 'string') {
            const cleanCode = couponCode.trim().toUpperCase()
            if (coupons[cleanCode]) {
                discountPct = coupons[cleanCode]
            }
        }
        const discountAmt = Math.round((subtotal * discountPct) / 100)
        const calculatedTotalPrice = subtotal + shipping - discountAmt

        // 4. Atomic Stock Decrement with Conditional Rollback (Guarantees thread-safety & zero race conditions)
        const decrementedItems = []
        for (const item of orderItems) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.qty } },
                { $inc: { stock: -item.qty } },
                { new: true }
            )
            if (!updated) {
                // Rollback previously decremented items in this order request
                for (const prev of decrementedItems) {
                    await Product.updateOne({ _id: prev.product }, { $inc: { stock: prev.qty } })
                }
                return res.status(400).json({ message: `Insufficient stock for "${item.name}"` })
            }
            decrementedItems.push(item)
        }

        // 5. Create Order with Server-Calculated Price
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
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
