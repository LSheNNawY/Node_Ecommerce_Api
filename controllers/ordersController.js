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



module.exports={
   getById
}
