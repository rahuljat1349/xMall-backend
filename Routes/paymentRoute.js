const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../Middlewares/Auth");
const {
   createOrder,
} = require("../Controllers/paymentController");

router.route("/payment").post(isAuthenticated, createOrder);

module.exports = router;
