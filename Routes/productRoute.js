const express = require("express");
const {
  getAllProducts,   
  createProduct,
  updateProducts,
  deleteProduct,
  getProductDetails,
} = require("../Controllers/productController");
const {searchAndFilterProducts} = require("../Utils/apifeatures");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/new").post(createProduct);
router.route("/products/search/").get(searchAndFilterProducts);

router
  .route("/product/:id")
  .put(updateProducts)
  .delete(deleteProduct)
  .get(getProductDetails);

  

module.exports = router;
