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

orderRouter.get('/:id', async function (req, res, next) {
    await ordersController.getById(req, res);
});

orderRouter.put('/:id', async function (req, res, next) {
    await ordersController.getByIdAndUpdate(req, res);
});


module.exports= orderRouter;