const Order = require('../models/Order')

const getAll = async(req,res)=>{
    const orders = await Order.find().populate('products').populate('user').sort("createdAt");
    res.send(orders );
}

const createOrder = async(req,res)=>{
    const { body } = req;
    try {
        const newOrder = await Order.create(body);
        if(newOrder){
            return res.status(200).send(newOrder);
         }        
    }catch(err){
        return res.status(500).send({ message: ' error in creating order' });
    }
}


module.exports={
    getAll,createOrder
}
