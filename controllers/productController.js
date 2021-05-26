const Product = require("../models/product");
const mongoose = require("mongoose");
const fs = require("fs");

/**
 * getAllProduct function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

const getAllProduct = async (req, res) => {
    try {
        if (req.query.ids) {
            const ids = req.query.ids.split(",");
            const productsIds = ids.map((id) => mongoose.Types.ObjectId(id));
            const products = await Product.find({_id: {$in: productsIds}});

            return res.status(200).json(products);
        } else {
            const products = await Product.find({});
            return res.status(200).json(products);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: "Error getting products"});
    }
};

/**
 * getProductById function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id});
        if (product) {
            return res.status(200).json(product);
        } else {
            return res.status(404).send({message: "product not found."});
        }
    } catch (err) {
        res.status(401).json({error: err});
    }
};

/**
 * createProduct function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
    });
    const imageName = Math.random() * 100000 + Date.now() + ".png";
    const path = "./public/uploads/products/" + imageName;
    console.log(path);
    const image = product.image;
    product.image = imageName;

    try {
        // to convert base64 format into random filename
        const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, "");
        fs.writeFile(path, base64Data, {encoding: "base64"}, () => {
        });
        const newProduct = await product.save();
        if (newProduct) {
            return res
                .status(201)
                .send({message: "new product created", data: newProduct});
        }
        return res.status(500).send({message: " Error in Creating Product."});
    } catch (err) {
        return res.status(401).json({error: err});
    }
};

/**
 * deleteProduct function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.remove();
            fs.rm(`./public/uploads/products/${product.image}`, () => {})
            return res.status(200).json({message: "Product Deleted", ok: true});
        }

        return res.status(404).json({message: "Error deleting product", ok: false});
    } catch (err) {
        return res.status(500).json({error: err});
    }
};

/**
 * editProduct function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const editProduct = async (req, res) => {
    const {body} = req
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        const oldImage = product.image;

        if (product) {
            product.name = body.name;
            product.price = body.price;
            product.description = body.description;

            if (body.image) {
                const imageName = Math.random() * 100000 + Date.now() + ".png";
                const path = "./public/uploads/products/" + imageName;

                product.image = imageName;
                // to convert base64 format into random filename
                const base64Data = body.image.replace(/^data:([A-Za-z-+/]+);base64,/, "");
                fs.writeFile(path, base64Data, {encoding: "base64"}, () => {
                    fs.rm(`./public/uploads/products/${oldImage}`, () => {
                    })
                });
            }

            const updatedProduct = await product.save();
            if (updatedProduct) {
                return res.status(200).send({
                    message: "product updated successfully"
                });
            }
        }
        return res.status(500).send({message: " error in updating product."});
    } catch (err) {
        return res.status(401).json({error: err});
    }
};

module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    deleteProduct,
    editProduct,
};
