const express = require('express');
const Product=require('../models/product');
const router = express.Router();
const productController = require('../controllers/productController')



//get all product

router.get('/',async (req, res, next)=>{
    await productController.getAllProduct(req, res);


})


// get product by id
router.get('/:id', async (req, res,next) => {
    await productController.getProductById(req, res);

});

//create product
router.post('/', async (req, res,next) => {
    await productController.createProduct(req, res);

});

// delete product by id
router.delete('/:id', async (req, res,next) => {
    await productController.deleteProduct(req, res);

});

// edit product by id
router.put('/:id', async (req, res,next) => {
    await productController.editProduct(req, res);

});

module.exports=router;
