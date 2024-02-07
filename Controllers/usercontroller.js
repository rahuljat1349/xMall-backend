const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registration of user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // checking if the email exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).json({ error: "Email already exists!" });
    }
    // creating user
    let secPass = await bcrypt.hash(password, 10);
    user = await User.create({
      name: name,
      email: email,
      password: secPass,
      avatar: {
        public_id: "sample id",
        url: "profileurl",
      },
    });
    // sending token
    const data = user.id;
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    return res.status(201).json({ authToken });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // checking if the user exists
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "email or password is wrong" });
    }

    // checking if the password is right
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res.status(400).json({ error: "email or password is wrong" });
    }
    // sending token
    const data = user.id;
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    return res.json({ authToken });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
