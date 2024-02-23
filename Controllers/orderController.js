const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paitAt: Date.now(),
      user: req.user._id,
    });
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get logged in User's Orders
exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for the user",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get single Order -- Admin
exports.getUserOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res.status(404).json({
        message: "order not found ",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Orders -- Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      return res.status(404).json({
        message: "No orders found",
      });
    }
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}; 
// Update Order status -- Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "You have already delivered this product.",
      });
    }
    order.orderItems.forEach(async (orderItem) => {
      await updateStock(orderItem.product, orderItem.quantity);
    });
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// function for update stock
let updateStock = async (id, quantity) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Order -- Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//
