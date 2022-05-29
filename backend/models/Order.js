const mongoose= require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderedItemsData: [
      {
        quantity: { type: String, required: true },

        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    deliveryAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentOption: {
      type: String,
      required: true,
    },
    paymentResult: {
      razorpayPaymentId: { type: String },
      razorpayOrderId: { type: String },
      razorpaySignature: { type: String },
    },

    deliveryPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    options: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
      receipt: { type: String, default: "receipt_order_74394" },
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);
module.exports= Order;
