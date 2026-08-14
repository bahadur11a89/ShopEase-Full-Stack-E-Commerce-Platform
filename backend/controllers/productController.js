const Product = require('../models/Product')

const sampleProducts = [
    // ===== ELECTRONICS (6) =====
    { name: 'iPhone 15 Pro', description: 'Apple iPhone 15 Pro with A17 Pro chip, 48MP camera, titanium design, 256GB storage.', price: 134999, originalPrice: 149999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', stock: 20, rating: 4.9, numReviews: 520, featured: true },
    { name: 'Samsung Galaxy S24', description: 'Samsung Galaxy S24 with Snapdragon 8 Gen 3, 50MP camera, 5G, 128GB.', price: 79999, originalPrice: 94999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', stock: 35, rating: 4.7, numReviews: 340, featured: true },
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancelling wireless headphones with 30hr battery.', price: 24999, originalPrice: 34999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', stock: 40, rating: 4.8, numReviews: 210, featured: true },
    { name: 'Apple MacBook Air M2', description: 'MacBook Air with M2 chip, 8GB RAM, 256GB SSD, 13.6 inch Liquid Retina display.', price: 114999, originalPrice: 129999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', stock: 15, rating: 4.9, numReviews: 180, featured: true },
    { name: 'Apple Watch Series 9', description: 'GPS + Cellular, 45mm, Always-On Retina display, health monitoring, crash detection.', price: 44999, originalPrice: 52999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', stock: 28, rating: 4.8, numReviews: 310, featured: true },
    { name: 'JBL Flip 6 Speaker', description: 'Portable waterproof Bluetooth speaker, 12hr playtime, powerful bass, IP67 rated.', price: 9999, originalPrice: 14999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', stock: 55, rating: 4.6, numReviews: 420, featured: false },

    // ===== FASHION (6) =====
    { name: 'Men\'s Slim Fit Suit', description: 'Premium wool blend slim fit suit, perfect for formal occasions and office wear.', price: 8999, originalPrice: 15999, category: 'Fashion', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600', stock: 30, rating: 4.5, numReviews: 88, featured: false },
    { name: 'Women\'s Floral Dress', description: 'Elegant floral print summer dress, lightweight fabric, available in S/M/L/XL.', price: 1499, originalPrice: 2999, category: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', stock: 80, rating: 4.4, numReviews: 156, featured: true },
    { name: 'Men\'s Casual Hoodie', description: 'Soft cotton blend hoodie with kangaroo pocket, perfect for casual everyday wear.', price: 1299, originalPrice: 2499, category: 'Fashion', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', stock: 100, rating: 4.3, numReviews: 234, featured: false },
    { name: 'Women\'s Kurti Set', description: 'Beautiful printed cotton kurti with palazzo pants, ethnic Indian wear.', price: 999, originalPrice: 1799, category: 'Fashion', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', stock: 120, rating: 4.5, numReviews: 312, featured: true },
    { name: 'Women\'s Saree', description: 'Pure silk Banarasi saree with golden zari work, perfect for weddings and festivals.', price: 4999, originalPrice: 8999, category: 'Fashion', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', stock: 25, rating: 4.7, numReviews: 145, featured: false },
    { name: 'Men\'s Formal Shirt', description: 'Premium cotton formal shirt, wrinkle-free, available in multiple colors.', price: 799, originalPrice: 1499, category: 'Fashion', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', stock: 150, rating: 4.3, numReviews: 267, featured: false },

    // ===== FOOTWEAR (6) =====
    { name: 'Nike Air Max 270', description: 'Nike Air Max 270 with large Air unit for all-day comfort, breathable mesh upper.', price: 12999, originalPrice: 17999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', stock: 50, rating: 4.7, numReviews: 380, featured: true },
    { name: 'Adidas Ultraboost 22', description: 'Adidas Ultraboost with BOOST midsole, Primeknit upper, perfect for running.', price: 14999, originalPrice: 19999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600', stock: 35, rating: 4.8, numReviews: 290, featured: true },
    { name: 'Men\'s Leather Formal Shoes', description: 'Genuine leather Oxford shoes with cushioned insole, perfect for office wear.', price: 3499, originalPrice: 5999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600', stock: 40, rating: 4.5, numReviews: 125, featured: false },
    { name: 'Women\'s Block Heels', description: 'Elegant block heels with ankle strap, comfortable for long wear, 3 inch height.', price: 1999, originalPrice: 3499, category: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', stock: 60, rating: 4.3, numReviews: 178, featured: false },
    { name: 'Puma Sports Shoes', description: 'Lightweight sports shoes with EVA midsole, perfect for gym and casual wear.', price: 4999, originalPrice: 7999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600', stock: 45, rating: 4.4, numReviews: 210, featured: false },
    { name: 'Woodland Trekking Boots', description: 'Waterproof leather trekking boots with anti-slip sole, ideal for outdoor adventures.', price: 5999, originalPrice: 8999, category: 'Footwear', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600', stock: 30, rating: 4.6, numReviews: 145, featured: false },

    // ===== ACCESSORIES (6) =====
    { name: 'Ray-Ban Aviator Sunglasses', description: 'Classic Ray-Ban Aviator with UV400 protection, gold frame, green lens.', price: 7999, originalPrice: 11999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', stock: 35, rating: 4.7, numReviews: 220, featured: true },
    { name: 'Leather Laptop Backpack', description: 'Premium PU leather backpack, fits 15.6 inch laptop, USB charging port, waterproof.', price: 2499, originalPrice: 4499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', stock: 55, rating: 4.5, numReviews: 178, featured: false },
    { name: 'Genuine Leather Wallet', description: 'Slim RFID blocking genuine leather wallet with 8 card slots and coin pocket.', price: 1299, originalPrice: 2499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600', stock: 80, rating: 4.4, numReviews: 95, featured: false },
    { name: 'Women\'s Handbag', description: 'Stylish PU leather handbag with multiple compartments, shoulder strap included.', price: 1799, originalPrice: 3499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', stock: 45, rating: 4.3, numReviews: 134, featured: false },
    { name: 'Men\'s Leather Belt', description: 'Genuine leather reversible belt, fits waist 28-44 inches, silver buckle.', price: 799, originalPrice: 1499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600', stock: 100, rating: 4.2, numReviews: 87, featured: false },
    { name: 'Gold Plated Necklace', description: 'Elegant 18K gold plated necklace with cubic zirconia pendant, gift box included.', price: 1499, originalPrice: 2999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', stock: 60, rating: 4.6, numReviews: 165, featured: true },

    // ===== HOME (6) =====
    { name: 'Philips Air Fryer', description: 'Digital air fryer 4.1L capacity, 13 preset programs, rapid air technology, 1400W.', price: 8999, originalPrice: 13999, category: 'Home', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600', stock: 25, rating: 4.7, numReviews: 312, featured: true },
    { name: 'Dyson V12 Vacuum Cleaner', description: 'Cordless vacuum cleaner with laser dust detection, 60min runtime, HEPA filter.', price: 44999, originalPrice: 59999, category: 'Home', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', stock: 15, rating: 4.8, numReviews: 145, featured: false },
    { name: 'Wooden Coffee Table', description: 'Solid sheesham wood coffee table with storage shelf, natural finish, 120x60cm.', price: 12999, originalPrice: 19999, category: 'Home', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', stock: 10, rating: 4.5, numReviews: 78, featured: false },
    { name: 'Instant Pot Pressure Cooker', description: '7-in-1 electric pressure cooker, 6L, slow cooker, rice cooker, steamer, saute.', price: 7499, originalPrice: 11999, category: 'Home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', stock: 30, rating: 4.6, numReviews: 234, featured: false },
    { name: 'LED Smart Bulb Set', description: 'Pack of 4 WiFi smart LED bulbs, 16 million colors, works with Alexa & Google Home.', price: 1999, originalPrice: 3499, category: 'Home', image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600', stock: 75, rating: 4.4, numReviews: 189, featured: false },
    { name: 'Memory Foam Pillow', description: 'Orthopedic cervical memory foam pillow, relieves neck pain, washable cover.', price: 1499, originalPrice: 2999, category: 'Home', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600', stock: 60, rating: 4.5, numReviews: 267, featured: true },

    // ===== BEAUTY (6) =====
    { name: 'Lakme 9to5 Lipstick Set', description: 'Set of 6 Lakme 9to5 matte lipsticks in trending shades, long lasting 12hr formula.', price: 1199, originalPrice: 1999, category: 'Beauty', image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=600', stock: 90, rating: 4.5, numReviews: 445, featured: true },
    { name: 'Mamaearth Vitamin C Serum', description: 'Brightening face serum with Vitamin C and Turmeric, reduces dark spots, 30ml.', price: 599, originalPrice: 999, category: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', stock: 120, rating: 4.4, numReviews: 678, featured: true },
    { name: 'Dyson Airwrap Styler', description: 'Multi-styler and dryer, curl, wave, smooth and dry hair simultaneously.', price: 44999, originalPrice: 54999, category: 'Beauty', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600', stock: 18, rating: 4.8, numReviews: 234, featured: false },
    { name: 'Neutrogena Sunscreen SPF 50', description: 'Ultra sheer dry-touch sunscreen SPF 50+, non-greasy, water resistant, 88ml.', price: 499, originalPrice: 799, category: 'Beauty', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600', stock: 150, rating: 4.3, numReviews: 512, featured: false },
    { name: 'Philips Hair Dryer', description: 'Professional 2200W hair dryer with ionic technology, 3 heat settings, cool shot.', price: 2499, originalPrice: 3999, category: 'Beauty', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600', stock: 40, rating: 4.4, numReviews: 189, featured: false },
    { name: 'Forest Essentials Face Wash', description: 'Luxury Ayurvedic face wash with pure rose water and neem, gentle daily cleanser.', price: 895, originalPrice: 1295, category: 'Beauty', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', stock: 85, rating: 4.6, numReviews: 298, featured: false },

    // ===== SPORTS (6) =====
    { name: 'Yonex Badminton Racket', description: 'Yonex Arcsaber 11 Pro badminton racket, carbon graphite, 4U weight, with cover.', price: 8999, originalPrice: 12999, category: 'Sports', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600', stock: 30, rating: 4.7, numReviews: 145, featured: false },
    { name: 'Nivia Football', description: 'FIFA approved match football, size 5, PU material, hand stitched, all weather.', price: 1299, originalPrice: 1999, category: 'Sports', image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600', stock: 60, rating: 4.5, numReviews: 234, featured: false },
    { name: 'Yoga Mat Premium', description: 'Extra thick 6mm non-slip yoga mat with carrying strap, eco-friendly TPE material.', price: 1499, originalPrice: 2499, category: 'Sports', image: 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=600', stock: 75, rating: 4.6, numReviews: 389, featured: true },
    { name: 'Adjustable Dumbbell Set', description: 'Adjustable dumbbell pair 2-20kg, quick-change weight plates, rubber coated.', price: 4999, originalPrice: 7999, category: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600', stock: 25, rating: 4.7, numReviews: 178, featured: true },
    { name: 'Decathlon Cycling Helmet', description: 'Lightweight road cycling helmet, 18 vents, adjustable fit system, CE certified.', price: 2999, originalPrice: 4999, category: 'Sports', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', stock: 35, rating: 4.4, numReviews: 112, featured: false },
    { name: 'Whey Protein 2kg', description: 'MuscleBlaze Whey Gold 2kg, 25g protein per serving, chocolate flavor, 66 servings.', price: 3499, originalPrice: 4999, category: 'Sports', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600', stock: 50, rating: 4.6, numReviews: 567, featured: true }
]

const getAllProducts = async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 8 } = req.query
        let query = {}
        if (category) query.category = category
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            query.name = { $regex: escapedSearch, $options: 'i' }
        }
        let sortObj = {}
        if (sort === 'price_asc') sortObj = { price: 1 }
        else if (sort === 'price_desc') sortObj = { price: -1 }
        else if (sort === 'rating') sortObj = { rating: -1 }
        else sortObj = { createdAt: -1 }
        const total = await Product.countDocuments(query)
        const products = await Product.find(query).sort(sortObj).limit(limit * 1).skip((page - 1) * limit)
        res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ featured: true }).limit(8)
        res.json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        res.json(product)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!product) return res.status(404).json({ message: 'Product not found' })
        res.json(product)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.json({ message: 'Product deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const seedProducts = async (req, res) => {
    try {
        await Product.deleteMany()
        await Product.insertMany(sampleProducts)
        res.json({ message: `✅ ${sampleProducts.length} products seeded successfully!` })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const addReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        const alreadyReviewed = product.reviews.find(r => r.user?.toString() === req.user._id.toString())
        if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' })
        product.reviews.push({ user: req.user._id, name: req.user.name, rating: req.body.rating, comment: req.body.comment })
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        await product.save()
        res.status(201).json({ message: 'Review added' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getAllProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, seedProducts, addReview }
