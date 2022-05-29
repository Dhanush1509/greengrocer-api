const express = require("express");
const router = express.Router();
const {
  loginUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  confirmEmail,
} = require("../controllers/userController.js");
const { protect, checkAdmin } = require("../middlewares/setAuthToken.js");
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/confirmation/:email/:token", confirmEmail);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .get(protect, checkAdmin, getUserById)
  .put(protect, checkAdmin, updateUser)
  .delete(protect, checkAdmin, deleteUser);
router.route("/").get(protect, checkAdmin, getUsers);
module.exports = router;
