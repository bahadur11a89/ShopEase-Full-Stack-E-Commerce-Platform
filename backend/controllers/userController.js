const User = require('../models/User')

const getAllUsers = async (req, res) => {
    try {
        const { search, role, page, limit = 10 } = req.query
        let query = {}

        if (role && role !== 'All') query.role = role

        if (search) {
            const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            query.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ]
        }

        const total = await User.countDocuments(query)

        if (page) {
            const pageNum = Number(page) || 1
            const users = await User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((pageNum - 1) * limit)

            return res.json({ users, total, pages: Math.ceil(total / limit), page: pageNum })
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 })
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' })
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getAllUsers, deleteUser }
