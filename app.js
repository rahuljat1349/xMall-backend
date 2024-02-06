const express = require("express");

const app = express();

app.use(express.json());

// Route imports
const productRoute = require("./Routes/productRoute");
const userRoute = require("./Routes/userRoute");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);

module.exports = app;
