const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now }
})

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true, enum: ['Electronics', 'Fashion', 'Footwear', 'Accessories', 'Home', 'Beauty', 'Sports'] },
    image: { type: String, required: true },
    stock: { type: Number, default: 10 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Product', productSchema)
