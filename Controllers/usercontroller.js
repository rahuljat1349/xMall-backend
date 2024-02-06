const User = require("../models/userModel");

// Registration of user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "sample id",
        url: "profileurl",
      },
    });
    res.status(201).json({
      syccess: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Registration of user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.create({
      email,
      password,
    });
    res.status(201).json({
      syccess: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
