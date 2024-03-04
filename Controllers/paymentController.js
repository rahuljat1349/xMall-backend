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
