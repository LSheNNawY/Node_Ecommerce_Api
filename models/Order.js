const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const Joi = require('joi');

const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },

    products: [
        {
            product_id:
                [{
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                }],
            quantity:
                {
                    type: Number,
                    default: 1
                },
            name:{
                type:String,
            }    
        }
    ],


    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: "pending"
    },
}, {timestamps: {createdAt: 'created_at', updatedAt: false}});
const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
    const schema = Joi.object({
        totalPrice: Joi.number().required(),
        products: Joi.required()
    });
    return schema.validate(order);
}

module.exports.Order = Order;
module.exports.validate = validateOrder;


