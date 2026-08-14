// Run: node seedAdmin.js
// Creates default admin + demo user in MongoDB

require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

async function seed() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected')

    // Admin user
    const adminExists = await User.findOne({ email: 'admin@shopease.com' })
    if (!adminExists) {
        await User.create({ name: 'Admin', email: 'admin@shopease.com', password: 'password123', role: 'admin' })
        console.log('✅ Admin created  → admin@shopease.com / password123')
    } else {
        console.log('ℹ️  Admin already exists')
    }

    // Demo user
    const userExists = await User.findOne({ email: 'user@shopease.com' })
    if (!userExists) {
        await User.create({ name: 'Demo User', email: 'user@shopease.com', password: 'password123', role: 'user' })
        console.log('✅ Demo user created → user@shopease.com / password123')
    } else {
        console.log('ℹ️  Demo user already exists')
    }

    await mongoose.disconnect()
    console.log('Done!')
    process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
