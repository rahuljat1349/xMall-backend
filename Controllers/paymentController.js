const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res, next) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "xMall",
      },
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
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
