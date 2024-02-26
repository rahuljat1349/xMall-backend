const stripe = require("stripe")(
  "sk_test_51OmbTCSAfvlVDoiIwv4AowRLx7MZISJQjbajLlsaWkRN2HrjsOOv5YSb04YDSoLbscWoqkidnjKhgHjru13xGICh00qlAa0sWV"
);

exports.processPayment = async (req, res, next) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: {
        company: "xMall",
      },
      description: "Your payment description here",
    });

    if (!myPayment.client_secret) {
      throw new Error("Invalid client_secret");
    }

    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.sendStripeApiKey = async (req, res, next) => {
  try {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_PUBLIC_KEY });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
