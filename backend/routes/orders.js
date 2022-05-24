import express from "express";
const router = express.Router();
import {
  addOrder, getOrderById,orderSuccess,getMyOrders,getAllOrders,updateOrderById
} from "../controllers/orderController.js";
import razorPayInstance from "../controllers/razorPayInstance.js";
import { protect, checkAdmin } from "../middlewares/setAuthToken.js";
router.route("/addorder").post(protect,addOrder);
router.route("/razorpay/generateid").post(protect, razorPayInstance);
router.route("/payment/success").post(protect, orderSuccess);
router.route("/getorder/:id").get(protect, getOrderById);

router.route("/myorders").get(protect, getMyOrders);
router
  .route("/:id")
  .put(protect, checkAdmin, updateOrderById)
router.route("/").get(protect, checkAdmin, getAllOrders);

export default router; 