const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {});
    console.log(`Connected to MongoDB on host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectToDatabase;
