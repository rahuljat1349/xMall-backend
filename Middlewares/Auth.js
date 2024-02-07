const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// checking if the user is logged in
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ massage: "Please authenticate using a valid token" });
    }
    const id = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
  } catch (error) {
    return res
      .status(401)
      .json({ massage: "Please authenticate using a valid token" });
  }
  next();
};

// Checking if the role is admin
exports.authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        Role: `${req.user.role} is not allowed to access this resource.`,
      });
    }
    next();
  };
};
