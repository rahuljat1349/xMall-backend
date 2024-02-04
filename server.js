const app = require("./app");

const dotenv = require("dotenv");
const connectToDatabase = require("./config/dbConnection");

// config
dotenv.config({ path: "config/config.env" });

// connect to database
connectToDatabase()


app.listen(process.env.PORT, () => {
  console.log(`server is listening on http://localhost:${process.env.PORT}`);
});
