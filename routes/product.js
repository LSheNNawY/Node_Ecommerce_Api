const express = require('express');
const Product=require('../models/product');
const router = express.Router();



//get all product

router.get('/',async (req, res, next)=>{
    const products = await Product.find({});
        res.send(products);

})


// get product by id
router.get('/:id', async (req, res,next) => {
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'product not found.' });
    }
});

//create product
router.post('/', async (req, res,next) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        description: req.body.description,
    });
    const newProduct = await product.save();
    if (newProduct) {
        return res
            .status(201)
            .send({ message: 'new product created', data: newProduct });
    }
    return res.status(500).send({ message: ' error in creating product.' });
});


module.exports=router;
