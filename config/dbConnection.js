const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {});
    console.log(`Connected to mongodb with ${mongoose.connection.host}`);
  } catch (error) {
    console.log("mongoDB connection error : ", error);
  }
};

module.exports = connectToDatabase;
