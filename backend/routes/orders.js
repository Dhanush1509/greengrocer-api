const express=require("express")
const router = express.Router();
const {
  addOrder,
  getOrderById,
  orderSuccess,
  getMyOrders,
  getAllOrders,
  updateOrderById,
} =require("../controllers/orderController.js");
const razorPayInstance= require("../controllers/razorPayInstance.js");
const { protect, checkAdmin } =require("../middlewares/setAuthToken.js");
router.route("/addorder").post(protect, addOrder);
router.route("/razorpay/generateid").post(protect, razorPayInstance);
router.route("/payment/success").post(protect, orderSuccess);
router.route("/getorder/:id").get(protect, getOrderById);

router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").put(protect, checkAdmin, updateOrderById);
router.route("/").get(protect, checkAdmin, getAllOrders);

module.exports= router;
