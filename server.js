const app = require("./app");

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

// connect to database
connectToDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Sutting down the server due to Unhandled Promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
