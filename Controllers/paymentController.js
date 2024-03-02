const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  const { amount, currency } = req.body;

  instance.orders.create({ amount, currency }, (err, order) => {
    if (!err) res.json(order);
    else res.send(err);
  });
};
