const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(cors());

// Route imports
const productRoute = require("./Routes/productRoute");
const userRoute = require("./Routes/userRoute");
const orderRoute = require("./Routes/orderRoute");
const paymentRoute = require("./Routes/paymentRoute");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1/", orderRoute);
app.use("/api/v1/", paymentRoute);

module.exports = app;
