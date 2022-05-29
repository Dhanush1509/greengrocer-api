const express = require("express");
const {
  getProduct,
  getProducts,
  getProductsForAdmin,
  deleteProduct,
  updateProduct,
  addProduct,
  addWishList,
  getWishList,
} = require("../controllers/productController.js");
const { checkAdmin, protect } = require("../middlewares/setAuthToken.js");

const router = express.Router();
router.route("/admin/addproduct").post(protect, checkAdmin, addProduct);
router.route("/admin").get(protect, checkAdmin, getProductsForAdmin);
router.route("/getwishlist").get(protect, getWishList);
router.route("/").get(getProducts);
router.route("/wishlist/:id").get(protect, addWishList);
router
  .route("/admin/:id")
  .delete(protect, checkAdmin, deleteProduct)
  .put(protect, checkAdmin, updateProduct);
router.route("/:id").get(getProduct);
module.exports = router;
