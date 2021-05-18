const {Order,validate} = require('../models/Order')
const User = require('../models/User')

const getAll = async(req,res)=>{
    const orders = await Order.find().populate('products').populate('user').sort("createdAt");
    res.send(orders );
}

const createOrder = async(req,res)=>{
    const { body } = req;
    const { error } =  await validate(body);
    if (error) return res.status(400).send(error.details[0].message); 
    const user = await User.findById("60a3f4a884a78a0e78d0f50b").select("_id"); //authenticated user
    body.user=user

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
