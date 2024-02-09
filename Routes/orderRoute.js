const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../Middlewares/Auth");
const {
  myOrders,
  getUserOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  newOrder,
} = require("../Controllers/orderController");
const router = express.Router();

router
  .route("/order/new/")
  .post(isAuthenticated, authorizeRoles("admin"), newOrder);
router.route("/orders/me/").get(isAuthenticated, myOrders);
router
  .route("/admin/order/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getUserOrder);
router
  .route("/admin/orders/")
  .get(isAuthenticated, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

module.exports = router;
