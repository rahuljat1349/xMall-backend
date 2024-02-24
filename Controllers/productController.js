const Product = require("../models/productModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

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
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLink;
    req.body.user = req.user.id;
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
exports.getAllProducts = async (req, res, next) => {
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

// Create or Update review
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    const isReviewd = await product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewd) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      await product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
    let avg = 0;

    product.reviews.forEach((rev) => (avg += rev.rating));
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get all reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);
    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const productId = req.query.productId;
    const reviewId = req.query.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Filter out the review to be deleted
    const updatedReviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId.toString()
    );

    // Recalculate average rating
    let avg = 0;
    if (updatedReviews.length > 0) {
      updatedReviews.forEach((rev) => (avg += rev.rating));
      avg /= updatedReviews.length;
    }

    // Update product with the new reviews and ratings
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        reviews: updatedReviews,
        ratings: isNaN(avg) ? 0 : avg, // Set to 0 if avg is NaN
        numOfReviews: updatedReviews.length,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
