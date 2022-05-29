const mongoose =require("mongoose");
const bcrypt= require("bcryptjs");
const WishListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  ],
});

const WishList = mongoose.model("WishList", WishListSchema);
module.exports= WishList;
