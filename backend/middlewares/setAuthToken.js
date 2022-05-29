const jwt =require("jsonwebtoken");
const User=require("../models/User.js")
const dotenv=require("dotenv")
dotenv.config();

exports.protect = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401);
    throw new Error("Authorisation denied");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401);
    throw new Error("Authorisation denied");
  }
};

exports.checkAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new Error("Danger!!, You are trying to access an unauthorised page");
  }
};

