const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../Middlewares/Auth");
const {
  getAllProducts,
  createProduct,
  updateProducts,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../Controllers/productController");
const { searchAndFilterProducts } = require("../Utils/apifeatures");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeRoles("admin"), createProduct);

  
router.route("/products/search/").get(searchAndFilterProducts);

router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProducts)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticated, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

module.exports = router;
