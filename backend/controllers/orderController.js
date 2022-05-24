import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import User from "../models/User.js";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
const addOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    delivery_Address,
    payment_Option,
    items_Price,
    delivery_Price,
    tax_Price,
    total_Price,
  } = req.body;

  const order = new Order({
    user: req.user._id,
    orderedItemsData: orderItems,
    deliveryAddress: delivery_Address,
    paymentOption: payment_Option,
    itemsPrice: items_Price,
    deliveryPrice: delivery_Price,
    taxPrice: tax_Price,
    totalPrice: total_Price,
  });
  const currentOrderItem = await order.save();
  // const orderDbId = currentOrderItem._id;
  // if(currentOrderItem)
  res.json(currentOrderItem);
});
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate("orderedItemsData.id", "name price image");
  res.json(order);
});
const orderSuccess = asyncHandler(async (req, res) => {
  // getting the details back from our font-end
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    orderIdOfCurrent,
  } = req.body;

  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
  const digest = shasum.digest("hex");

  if (digest !== razorpaySignature) {
    return res.status(400).json({ msg: "Transaction not legit!" });
  }
  const order = await Order.findById(orderIdOfCurrent)
    .populate("user", "name email")
    .populate("orderedItemsData.id", "name price");

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    };

    const updatedOrder = await order.save();
    if (updatedOrder) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: order.user.email,
        from: "s.munidhanush15@gmail.com", // Use the email address or domain you verified above
        subject: "I ❤ Greengrocer",
        html: `<h4>Hello ${order.user.name}, welcome to Greengrocer</h4>
    <h5>Your payment is successful for your recent order,  order id:  <a href="/order/${
      order._id
    }">${order._id}</a> and  payment_id: ${
          order.paymentResult.razorpayPaymentId
        } . We are processing delivery</h5>
   <center><p>Your Order Summary</p>
   <table style="width:80%;text-align:left;">
   <tr>  
   <th>Product Id</th>
   <th>Item name</th>
   <th>Quantity</th>
   <th>Price</th></tr>
 ${order.orderedItemsData.map((item) => {
   return `<tr>
<td><a href="/products/${item.id._id}">${item.id._id}</a></td>
<td>${item.id.name}</td>
<td>${item.quantity}</td>
<td>₹${item.id.price}</td>
</tr>`;
 })}
   </table>
   </center> 
   <p>Total price of the above order ₹${
     order.totalPrice
   } (Tax and delivery charges included)</p>
   <p>We will be delivering your order at ${order.deliveryAddress.address},${
          order.deliveryAddress.city
        },${order.deliveryAddress.country}-${order.deliveryAddress.postalCode} 
   and expected to delivery by Tommorrow </p><a href="/order/${
     order._id
   }">Click here for more details</a>`,
      };
      //ES6

      const msg1 = {
        to: "learndailysomethingnew@gmail.com",
        from: "s.munidhanush15@gmail.com", // Use the email address or domain you verified above
        subject: "I ❤ Greengrocer",
        html: `<h4>Hello Admin🙂, welcome to Greengrocer</h4>
    <h5>You got a new order from ${order.user.name},email:<a href="mailto:${
          order.user.email
        }">${
          order.user.email
        }</a>, payment is successful for the order,  order id:  <a href="/order/${
          order._id
        }">${order._id}</a> and  payment_id: ${
          order.paymentResult.razorpayPaymentId
        } . Process the delivery</h5>

   <center><p>Order Summary</p>

   <table style="width:80%;text-align:left;">
   <tr>  
   <th>Product Id</th>
   <th>Item name</th>
   <th>Quantity</th>
   <th>Price</th></tr>
 ${order.orderedItemsData.map((item) => {
   return `<tr>
<td><a href="/products/${item.id._id}">${item.id._id}</a></td>
<td>${item.id.name}</td>
<td>${item.quantity}</td>
<td>₹${item.id.price}</td>
</tr>`;
 })}
   </table>
   </center> 
   <p>Total price of the above order ₹${
     order.totalPrice
   } (Tax and delivery charges included)</p>
   <p>You have to deliver your order at ${order.deliveryAddress.address},${
          order.deliveryAddress.city
        },${order.deliveryAddress.country}-${order.deliveryAddress.postalCode} 
   and expected to delivery by Tommorrow  </p><a href="/order/${
     order._id
   }">Click here for more details</a>`,
      };
      //ES6

      //ES8f
      sgMail.send(msg).then(
        () => {},
        (error) => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
        }
      );

      //ES8
      sgMail.send(msg1).then(
        () => {},
        (error) => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
        }
      );
    }
    res.json(updatedOrder);
  } else {
    throw new Error("Payment request failed");
  }
});
const getMyOrders = asyncHandler(async (req, res) => {
  const myorders = await Order.find({ user: req.user._id }).select(
    "-paymentResult.razorpaySignature -paymentResult.razorpayOrderId -order.deliveryAddress -deliveryPrice -itemsPrice -options -orderedItemsData -paymentOption -user -UpdatedAt -taxPrice"
  );
  if (myorders) {
    res.status(200).json(myorders);
  } else {
    throw new Error("Orders not found");
  }
});
// }
// THE PAYMENT IS LEGIT & VERIFIED
// YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .sort([["isDelivered", 1]])
    .sort([["isPaid", -1]]);
  if (orders) {
    res.status(200).json({ orders });
  } else {
    throw new Error("Orders not found");
  }
});
const updateOrderById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    throw new Error("Some error occurred");
  }
});

export {
  addOrder,
  getOrderById,
  orderSuccess,
  getMyOrders,
  getAllOrders,
  updateOrderById,
};
