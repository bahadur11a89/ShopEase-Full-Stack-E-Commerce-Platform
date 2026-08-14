const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
        const normalizedEmail = email.toLowerCase().trim()
        const exists = await User.findOne({ email: normalizedEmail })
        if (exists) return res.status(400).json({ message: 'Email already registered' })
        const user = await User.create({ name: name.trim(), email: normalizedEmail, password })
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
        const normalizedEmail = email.toLowerCase().trim()
        const user = await User.findOne({ email: normalizedEmail })
        if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password' })
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getProfile = async (req, res) => {
    res.json(req.user)
}

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        if (req.body.name) user.name = req.body.name.trim()
        if (req.body.phone !== undefined) user.phone = req.body.phone
        if (req.body.address !== undefined) user.address = req.body.address
        if (req.body.password) user.password = req.body.password
        const updated = await user.save()
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            phone: updated.phone,
            address: updated.address,
            token: generateToken(updated._id)
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { register, login, getProfile, updateProfile }
