const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(process.env.DB_URI, {});
  console.log(`Connected to mongodb with ${mongoose.connection.host}`);
};

module.exports = connectToDatabase;
