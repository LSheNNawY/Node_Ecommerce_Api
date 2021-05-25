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
      const products = await Product.find({ _id: { $in: productsIds } });

      return res.status(200).json(products);
    } else {
      const products = await Product.find({});
      return res.status(200).json(products);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error getting products" });
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
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).send({ message: "product not found." });
    }
  } catch (err) {
    res.status(401).json({ error: err });
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
    // brand: req.body.brand,
    // category: req.body.category,
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
    fs.writeFile(path, base64Data, { encoding: "base64" }, () => {});
    const newProduct = await product.save();
    if (newProduct) {
      return res
        .status(201)
        .send({ message: "new product created", data: newProduct });
    }
    return res.status(500).send({ message: " Error in Creating Product." });
  } catch (err) {
    return res.status(401).json({ error: err });
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
    const deletedProduct = await Product.findById(req.params.id);

    if (deletedProduct) {
      await deletedProduct.remove();
      res.send({ message: "Product Deleted" });
    } else {
      res.send("Error in Deletion.");
    }
  } catch (err) {
    res.status(401).json({ error: err });
  }
};

/**
 * editProduct function
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const editProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  console.log(product);
  try {
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        return res.status(200).send({
          message: "product updated successfully",
          data: updatedProduct,
        });
      }
    }
    return res.status(500).send({ message: " error in updating product." });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  createProduct,
  deleteProduct,
  editProduct,
};
