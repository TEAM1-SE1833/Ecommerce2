const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        salePrice: Number, 
        saleCost: Number, 
        color: {
            type: String,
            required: true
        }
    }],
    totalPrice: Number,
    shippingFee: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing',

        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'VnPay', 'Cash On Delivery', 'PayOS'],
        required: true
    },
    paymentDetails: {
        transactionId: String,
        orderCode: String,
        paymentLinkId: String,
        paymentTime: Date
    },
    contactInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
