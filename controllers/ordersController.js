const Order = require('../models/Order')

const getById = async(req,res)=>{
    try {
    const order= await Order.findOne({ _id: req.params.id });
    if (order) {
        res.send(order);
    } 
}catch(err){
    return res.status(400).send({"message":"order not found"});
 }
}
const getByIdAndUpdate = async(req,res)=>{
    try {
    const order =await Order.findOneAndUpdate(
        req.params.id,
        {
            status:req.body.status
        }
    );
    if (order) {
        res.send(order);
    } 
}catch(err){
    return res.status(400).send({"message":"order not found"});
 }

    
}
module.exports={
   getById,getByIdAndUpdate
}
