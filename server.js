const app = require("./app");
const clouidinary = require("cloudinary");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/dbConnection");

//Hnadling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Sutting down the server due to Uncaught Exception");

  process.exit(1);
});

// config
dotenv.config({ path: "config/config.env" });
clouidinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// connect to database
connectToDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is started`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
