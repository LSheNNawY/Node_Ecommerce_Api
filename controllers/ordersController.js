const mongoose  = require('mongoose');
const {Order,validate} = require('../models/Order')
const Product = require('../models/product')
const User = require('../models/User')
var lodash = require('lodash');

const getAll = async(req,res)=>{
    console.log(req.query)
    if(req.query.userId){
        try{ const user =await User.findOne(mongoose.Types.ObjectId(req.query.userId))
            const order = await Order.findOne({},[],{$orderby:{ }}).populate('products').populate('user');
            return res.status(200).json(order);
        }
            catch(err){
                console.log(err)
                return res.status(400).send({"message":"order not found"});
            }
    }
    const orders = await Order.find().populate('products').populate('user').sort("createdAt");
    const order =orders.map(orders=>orders.products)
    let product = {}
    let products=[]

    for (i=0;i<order.length;i++){
        for(j=0;j<order[i].length;j++){ 
        const productId=order[i][j].product_id
        product =  await Product.findById(productId)
     
        }
        products.push(product)
       
        console.log(products)
    }

      
//    console.log(order[2][0].product_id)
    // console.log(order)
  
    res.send({orders:orders,products:products});
}

const createOrder = async(req,res)=>{
    const { body } = req;
  //  const { error } =  await validate(body);
  //  if (error) return res.status(400).send(error.details[0].message); 
  //  const user = await User.findById("60a3f4a884a78a0e78d0f50b").select("_id"); //authenticated //user
  //  body.user=user

    try {
        const newOrder = await Order.create(body);
        if(newOrder){
            return res.status(200).send(newOrder);
         }        
    }catch(err){
        return res.status(500).send({ message: ' error in creating order' });
    }
}


const getById = async(req,res)=>{
    try {
    const order= await Order.findOne({ _id: req.params.id }).populate('products').populate('user').sort("createdAt");
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
    getAll,createOrder, getById, getByIdAndUpdate
}
