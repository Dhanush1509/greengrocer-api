import mongoose from "mongoose";
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type:String, // data: Buffer, contentType: String,
      required:true
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    keywords: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    itemSold: {
      type: Number,
      required: true,
      default: 0,
    },
    specialPrice: {
      type:Boolean,default:false,required:true
    }
    // wishList:[{
    //     favouriteItem:{type:Boolean,default:false,required:true}
    // }]
  },
  { timestamps:true }
);
const Product = mongoose.model("Product", productSchema);
export default  Product;
