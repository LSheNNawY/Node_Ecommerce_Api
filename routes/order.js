const Order = require('../models/Order')
const ordersController = require('../controllers/ordersController')
const express = require('express')
const orderRouter = express.Router();

//get orders
orderRouter.get('/', async function (req, res, next) {
    await ordersController.getAll(req, res);
});


orderRouter.post('/', async (req, res,next) => {
    await ordersController.createOrder(req, res);
});



module.exports= orderRouter;
