import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 9;
  const page = Number(req.query.productpage) || 1;

  const keyword = req.query.keyword
    ? {
        keywords: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // console.log(products)
  if (products.length !== 0)
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  else {
    throw new Error("Products not found");
  }
});
const getProductsForAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  // console.log(products)
  if (products) res.json(products);
  else {
    throw new Error("Products not found");
  }
});
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    throw new Error("Product not found");
  }
});
const addProduct = asyncHandler(async (req, res) => {
  
  
  const {
    name,
    description,
    image,
    category,
    keywords,
    price,
    itemsSold,
    countInStock,
  } = req.body;
  const product =new Product({
    user:req.user._id,
  name,
  image,
  category, 
  description,
  keywords: `${keywords},${description},${category},${name}`,
  price:Number(price),
  itemsSold:Number(itemsSold),
  countInStock:Number(countInStock), 
  })
    const saveProduct = await product.save();
    if (saveProduct) {
      res.status(200).json({ message: "Product saved successfully" });
    } else {
      res.status(400)
      throw new Error("Product not saved successfully")
    }
});
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const {
    name,
    description,
    image,
    category,
    keywords,
    price,
    itemsSold,
    countInStock,
  } = req.body;
  if (product) {
    product.name = name || product.name;
    product.image = image || product.image;
    product.category = category || product.category;
    product.description = description || product.description;
    product.keywords = keywords || product.keywords;
    product.price = price || product.price;
    product.itemsSold = itemsSold || product.itemsSold;
    product.countInStock = countInStock || product.countInStock;

    const saveProduct = await product.save();
    if (saveProduct) {
      res.status(200).json({ message: "Product saved successfully"});
    } else {
      res.status(400).json({ message: "Product not saved successfully" });
    }
  } else {
    throw new Error("Product not found");
  }
});
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    throw new Error("Product not found");
  }
});
export {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsForAdmin,
  addProduct
};
