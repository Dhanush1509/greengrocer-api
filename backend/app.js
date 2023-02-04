const express = require("express");
const colors = require("colors");
const DB_CONNECT = require("./config/db.js");
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const products = require("./routes/products.js");
const users = require("./routes/users.js");
const orders = require("./routes/orders.js");
const chats = require("./routes/chats.js");
const messages = require("./routes/messages.js");
const { resendLink } = require("./controllers/userController.js");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
DB_CONNECT();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.URL);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.use("/products", products);
app.use("/users", users);
app.use("/orders", orders);
app.use("/chats", chats);
app.use("/messages", messages);
app.post("/resendlink", resendLink);
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
    console.log("typing", room);
  });
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("notification", (userId, notification) => {
    console.log(userId, notification,process.env.ADMIN_ID);
    socket.in(userId).emit("notification", notification);
     socket.in(process.env.ADMIN_ID).emit("notification", notification);
  });
  socket.on("new message", (newMessageRecieved) => {
    console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      // socket.in(chat.groupAdmin).emit("message recieved", newMessageRecieved);
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
