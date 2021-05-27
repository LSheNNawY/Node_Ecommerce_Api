const mongoose = require('mongoose');
const {Order, validate} = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/product')


const getAll = async (req, res) => {
    if (req.query.userId) {
        try {
            const user = await User.findOne(mongoose.Types.ObjectId(req.query.userId))
            const order = await Order.findOne({}, [], {$orderby: {'created_at': -1}}).populate('products').populate('user');
            return res.status(200).json(order);
        } catch (err) {
            console.log(err)
            return res.status(400).send({"message": "order not found"});


        }

    }
    const orders = await Order.find().populate('products').populate('user').sort("createdAt");

    const products = orders.map((order)=> order.products);
    let productObj={};

    for(let i=0; i< products.length; i++){
        for(let j=0; j< products[i].length;j++){
            product_id = products[i][j].product_id
            productObj= await Product.findById(product_id );
            orders[i].products[j].name=productObj.name;
        }
    } 
    res.send(orders);
}

const createOrder = async (req, res) => {
    const {body} = req;
    try {
        const newOrder = await Order.create(body);
        if (newOrder) {
            return res.status(200).send(newOrder);
        }
    } catch (err) {
        return res.status(500).send({message: 'Error in creating order'});
    }
}


const getById = async (req, res) => {
    try {
        const order = await Order.findOne({_id: req.params.id}).populate('products').populate('user').sort("createdAt");
        if (order) {
            res.send(order);
        }
    } catch (err) {
        return res.status(400).send({"message": "order not found"});
    }
}
const getByIdAndUpdate = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params.id);
        const order = await Order.findOneAndUpdate({_id:req.params.id},{status: req.body.status},{new:true});

        if (order) {
            res.send(order);
        }
    } catch (err) {
        return res.status(400).send({"message": "order not found"});
    }

}

module.exports = {
    getAll, createOrder, getById, getByIdAndUpdate
}

