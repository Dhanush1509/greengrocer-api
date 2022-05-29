const Razorpay=require("razorpay")
const asyncHandler=require("express-async-handler")
const {nanoid}=require("nanoid")
const dotenv=require("dotenv")
dotenv.config();
const razorPayInstance = asyncHandler(async (req, res) => {
  console.log(process.env);
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  // console.log(req.user._id)

  const options = {
    amount: req.body.amount * 100, // amount in smallest currency unit
    currency: "INR",
    receipt: nanoid(6),
  };
  await instance.orders.create(options, (err, order) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(201).json(order);
    }
  });
});
module.exports= razorPayInstance;
