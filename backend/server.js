const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
// Server Entrypoint
const path = require('path')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files - Serve both public and frontend
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '../frontend')))

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('⚠️  MongoDB not connected:', err.message))

// ===== API Routes =====
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))

// ===== HTML Page Routes =====
const fs = require('fs')
const pub = (file) => (req, res) => {
    const fePath = path.join(__dirname, '../frontend', file)
    if (fs.existsSync(fePath)) return res.sendFile(fePath)
    res.sendFile(path.join(__dirname, 'public', file))
}
const pages = (file) => (req, res) => {
    const fePath = path.join(__dirname, '../frontend', 'pages', file)
    if (fs.existsSync(fePath)) return res.sendFile(fePath)
    res.sendFile(path.join(__dirname, 'public', 'pages', file))
}

app.get('/', pub('index.html'))
app.get('/about', pages('about.html'))
app.get('/services', pages('services.html'))
app.get('/gallery', pages('gallery.html'))
app.get('/contact', pages('contact.html'))
app.get('/shop', pages('shop.html'))
app.get('/cart', pages('cart.html'))
app.get('/login', pages('login.html'))
app.get('/register', pages('register.html'))
app.get('/admin', pages('admin.html'))
app.get('/profile', pages('profile.html'))

app.use((req, res) => {
    const fe404 = path.join(__dirname, '../frontend/pages/404.html')
    if (fs.existsSync(fe404)) return res.status(404).sendFile(fe404)
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'))
})

const PORT = process.env.PORT || 3000

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log('')
        console.log('🚀 ================================')
        console.log(`🛍️  ShopEase Server STARTED!`)
        console.log(`🌐 URL: http://localhost:${PORT}`)
        console.log(`📦 Mode: ${process.env.NODE_ENV}`)
        console.log('🚀 ================================')
        console.log('')
        console.log('📄 Pages:')
        console.log(`   Home     → http://localhost:${PORT}/`)
        console.log(`   Shop     → http://localhost:${PORT}/shop`)
        console.log(`   Cart     → http://localhost:${PORT}/cart`)
        console.log(`   Login    → http://localhost:${PORT}/login`)
        console.log(`   Register → http://localhost:${PORT}/register`)
        console.log(`   Admin    → http://localhost:${PORT}/admin`)
        console.log('')
        console.log('🔌 API Endpoints:')
        console.log(`   Products → http://localhost:${PORT}/api/products`)
        console.log(`   Auth     → http://localhost:${PORT}/api/auth`)
        console.log(`   Orders   → http://localhost:${PORT}/api/orders`)
        console.log(`   Users    → http://localhost:${PORT}/api/users`)
        console.log(`   Seed DB  → http://localhost:${PORT}/api/products/seed`)
        console.log('')
    })
}

module.exports = app

