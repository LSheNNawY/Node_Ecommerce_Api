const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    totalPrice:{
        type: Number,
        default: 0,
        required: true
    },
 
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required:true
    }],

    status: {
        type: String,
        enum: ['pending','accepted','rejected'],
        required: true
    },
},{timestamps: {createdAt: 'created_at', updatedAt: false}});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
