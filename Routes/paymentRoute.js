const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../Middlewares/Auth");
const {
  processPayment,
  sendStripeApiKey,
} = require("../Controllers/paymentController");

router.route("/payment").post(isAuthenticated, processPayment);
router.route("/stripeapikey").get(isAuthenticated, sendStripeApiKey);

module.exports = router;
