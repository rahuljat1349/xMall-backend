const Razorpay = require("razorpay");

exports.createOrder = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.confirmOrder = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const attributes = {
      order_id: razorpayOrderId,
      payment_id: razorpayPaymentId,
      signature: razorpaySignature,
    };

    // Verify the payment using the Razorpay API
    instance.payments
      .fetch(razorpayPaymentId)
      .then((payment) => {
        if (payment.status === "captured") {
          // Payment successful
          res.json({ success: true, message: "Payment successful." });
        } else {
          // Payment failed or not captured
          res.status(400).json({
            success: false,
            message: "Payment failed or not captured.",
          });
        }
      })
      .catch((error) => {
        console.error("Error verifying payment:", error.message);
        res
          .status(500)
          .json({ success: false, message: "Error verifying payment." });
      });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment." });
  }
};
