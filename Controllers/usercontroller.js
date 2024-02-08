const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../Utils/sendEmail");

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
    // return res.cookie("token", authToken, {
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // });
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
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "email or password is wrong" });
    }

    // checking if the password is right
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(401).json({ error: "email or password is wrong" });
    }
    // sending token
    const data = user.id;
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    // return res.cookie("token", authToken, {
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // });
    return res.json({ authToken });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get User Details

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//  Update User Password

exports.UpdatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordMatched = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "old password is in correct" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }
    let secPass = await bcrypt.hash(req.body.newPassword, 10);

    user.password = secPass;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

// Forgot password

exports.forgotPassword = async (req, res, next) => {
  let user; // Declare user outside the try block

  try {
    user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 12 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;

    await sendEmail({
      email: user.email,
      subject: "AmberStore Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });

    next();
  } catch (error) {
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    return res.status(500).json({ error: error.message });
  }
};
