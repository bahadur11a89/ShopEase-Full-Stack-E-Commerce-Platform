const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'shopease_super_secret_key_2026'

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' })
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        if (!req.user) return res.status(401).json({ message: 'User not found' })
        next()
    } catch (err) {
        res.status(401).json({ message: 'Token invalid or expired. Please login again.' })
    }
}

const adminOnly = (req, res, next) => {
    if (req.user?.role === 'admin') return next()
    res.status(403).json({ message: 'Admin access only' })
}

module.exports = { protect, adminOnly }
