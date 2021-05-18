const Order = require('../models/Order')
const ordersController = require('../controllers/ordersController')
const express = require('express')
const orderRouter = express.Router();


orderRouter.get('/:id', async function (req, res, next) {
    await ordersController.getById(req, res);
});




module.exports= orderRouter;
