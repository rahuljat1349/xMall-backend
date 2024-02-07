const Product = require("../models/productModel");
const mongoose = require("mongoose");
const isAuthenticated = require("../Middlewares/isAuthenticated")


// Handle Wrong mongoDB error
const isValidProductId = (productId, res) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400).json({
      success: false,
      message: "Resource not found.",
    });
    return false;
  }
  return true;
};

// Create Product -- Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Product Details
exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!isValidProductId(productId, res)) {
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update Product -- Admin
exports.updateProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!isValidProductId(productId, res)) {
      return;
    }

    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete product -- Admin
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!isValidProductId(productId, res)) {
      return;
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
