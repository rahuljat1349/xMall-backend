const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../Middlewares/Auth");
const {
  getAllProducts,
  createProduct,
  updateProducts,
  deleteProduct,
  getProductDetails,
} = require("../Controllers/productController");
const { searchAndFilterProducts } = require("../Utils/apifeatures");

const router = express.Router();

router
  .route("/products")
  .get(getAllProducts);

router   
  .route("/product/new")
  .post(isAuthenticated, authorizeRoles("admin"), createProduct);
router.route("/products/search/").get(searchAndFilterProducts);

router
  .route("/product/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProducts)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct)
  .get(getProductDetails);

module.exports = router;
