const express = require("express");
const {
  isAuthenticated,
  forgotPassword,
  authorizeRoles,
} = require("../Middlewares/Auth");
const {
  registerUser,
  loginUser,
  getUserDetails,
  UpdatePassword,
  UpdateProfile,
  getSingleUser,
  getAllUsers,
  UpdateUserRole,
  deleteUser,
  // forgotPassword
} = require("../Controllers/usercontroller");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticated, getUserDetails);

router.route("/password/update").put(isAuthenticated, UpdatePassword);

router.route("/me/update").put(isAuthenticated, UpdateProfile);

router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/users/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticated, authorizeRoles("admin"), UpdateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"),deleteUser);

// router.route("/password/forgot").post(forgotPassword);

module.exports = router;
