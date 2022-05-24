import express from 'express';
import {getProduct,getProducts,getProductsForAdmin,deleteProduct,updateProduct,addProduct} from '../controllers/productController.js'
import {checkAdmin,protect} from "../middlewares/setAuthToken.js"
import Product from '../models/Product.js'

const router=express.Router();
router.route("/admin/addproduct").post(protect,checkAdmin,addProduct);
router.route("/admin/:id").delete(protect,checkAdmin,deleteProduct).put(protect,checkAdmin,updateProduct)
router.route("/admin").get(protect,checkAdmin,getProductsForAdmin)
router.route('/').get(getProducts)
router.route("/:id").get(getProduct);
export default router;