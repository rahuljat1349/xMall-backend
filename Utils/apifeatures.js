const Product = require("../models/productModel");
const mongoose = require("mongoose");

// Search and Filter Products with Pagination
exports.searchAndFilterProducts = async (req, res) => {
  try {
    const key = req.query.key;
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const page = parseInt(req.query.page) || 1; // default to page 1
    const pageSize = parseInt(req.query.pageSize) || 12; // default to 10 items per page

    // Build the filter object based on the provided query parameters
    const filter = {};

    if (key) {
      filter.$or = [
        { name: { $regex: key, $options: "i" } },
        { description: { $regex: key, $options: "i" } },
        { category: { $regex: key, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    // Use the filter object in the query with pagination
    const skip = (page - 1) * pageSize;
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / pageSize);

    let products = await Product.find(filter).skip(skip).limit(pageSize);

    res.json({
      products,
      page,
      pageSize,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    console.error("Error in searchAndFilterProducts:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
