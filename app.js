const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Route imports
const productRoute = require("./Routes/productRoute");
const userRoute = require("./Routes/userRoute");
const orderRoute = require("./Routes/orderRoute");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1/", orderRoute);

module.exports = app;
