const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../Middlewares/Auth");
const {
   createOrder, confirmOrder,
} = require("../Controllers/paymentController");

router.route("/payment").post(isAuthenticated, createOrder);
router.route("/payment/confirm").post(isAuthenticated, confirmOrder);

module.exports = router;
