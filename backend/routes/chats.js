const express = require("express");
const router = express.Router();
const {
  accessChat,fetchChats
} = require("../controllers/chatController.js");
const { protect, checkAdmin } = require("../middlewares/setAuthToken.js");

router.route("/").get(protect, fetchChats);
router.route("/:userId").post(protect, accessChat);
module.exports = router;
