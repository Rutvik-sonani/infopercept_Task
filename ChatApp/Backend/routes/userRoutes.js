const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  allUsers,
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(protect, allUsers);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
