const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        price: Number,
        qty: Number
    }],
    shippingAddress: {
        name: String,
        phone: String,
        address: String,
        city: String,
        pincode: String
    },
    paymentMethod: { type: String, default: 'COD' },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', orderSchema)
