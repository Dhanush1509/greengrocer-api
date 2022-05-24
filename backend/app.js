import express from "express";
import colors from "colors";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import products from "./routes/products.js";
import users from "./routes/users.js";
import orders from "./routes/orders.js";
import DB_CONNECT from "./config/db.js";
import dotenv from "dotenv";
import { resendLink } from "./controllers/userController.js";
import path from "path";

const app = express();
dotenv.config();

DB_CONNECT();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.use("/products", products);
app.use("/users", users);
app.use("/orders", orders);
app.post("/resendlink", resendLink);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at ${PORT}`.yellow.bold));
