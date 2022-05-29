const jwt =require("jsonwebtoken");
const dotenv=require("dotenv")
dotenv.config();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT, { expiresIn: "15d" });
};
module.exports= generateToken;
