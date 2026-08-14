const Product = require('../models/Product')
const Order = require('../models/Order')
const User = require('../models/User')

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const totalUsers = await User.countDocuments()
        const pendingOrders = await Order.countDocuments({ status: 'Pending' })
        const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } })

        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ])
        const totalRevenue = revenueResult[0]?.total || 0

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
            pendingOrders,
            lowStockCount
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/admin/analytics?range=7days|30days|thismonth|all
const getAdminAnalytics = async (req, res) => {
    try {
        const { range = '30days' } = req.query
        let dateFilter = {}
        const now = new Date()

        if (range === '7days') {
            const startDate = new Date(now)
            startDate.setDate(now.getDate() - 7)
            dateFilter = { createdAt: { $gte: startDate } }
        } else if (range === '30days') {
            const startDate = new Date(now)
            startDate.setDate(now.getDate() - 30)
            dateFilter = { createdAt: { $gte: startDate } }
        } else if (range === 'thismonth') {
            const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            dateFilter = { createdAt: { $gte: startDate } }
        }

        // Sales & Revenue timeline
        const timeline = await Order.aggregate([
            { $match: { ...dateFilter, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        // Status breakdown
        const statusBreakdown = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ])

        const statusMap = {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0
        }
        statusBreakdown.forEach(s => { if (s._id) statusMap[s._id] = s.count })

        res.json({
            timeline,
            statusMap
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/admin/low-stock
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: { $lte: 10 } }).sort({ stock: 1 }).limit(10)
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/admin/activity
const getAdminActivity = async (req, res) => {
    try {
        const recentOrders = await Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5)
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5)
        const lowStock = await Product.find({ stock: { $lte: 5 } }).limit(5)

        const activities = []

        recentOrders.forEach(o => {
            activities.push({
                id: o._id,
                type: 'order',
                icon: '🛒',
                title: `New order #${o._id.toString().slice(-6).toUpperCase()} by ${o.user?.name || 'Customer'}`,
                subtitle: `Total ₹${o.totalPrice.toLocaleString()} — Status: ${o.status}`,
                timestamp: o.createdAt
            })
        })

        recentUsers.forEach(u => {
            activities.push({
                id: u._id,
                type: 'user',
                icon: '👤',
                title: `New user registration: ${u.name}`,
                subtitle: `Email: ${u.email} — Role: ${u.role}`,
                timestamp: u.createdAt
            })
        })

        lowStock.forEach(p => {
            activities.push({
                id: p._id,
                type: 'stock',
                icon: '⚠️',
                title: `Low Stock Alert: ${p.name}`,
                subtitle: `Only ${p.stock} item(s) remaining in inventory`,
                timestamp: p.createdAt
            })
        })

        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        res.json(activities.slice(0, 10))
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getAdminStats,
    getAdminAnalytics,
    getLowStockProducts,
    getAdminActivity
}
