import express from "express";
const router = express.Router();
import {
  loginUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  confirmEmail
} from "../controllers/userController.js";
import { protect, checkAdmin } from "../middlewares/setAuthToken.js";
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

export default router;
