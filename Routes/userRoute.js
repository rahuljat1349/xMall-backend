const express = require("express");
const { isAuthenticated, forgotPassword } = require("../Middlewares/Auth");
const {
  registerUser,
  loginUser,
  getUserDetails,
  UpdatePassword,
  // forgotPassword
} = require("../Controllers/usercontroller");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticated, getUserDetails);

router.route("/password/update").put(isAuthenticated, UpdatePassword);

// router.route("/password/forgot").post(forgotPassword);


module.exports = router;
