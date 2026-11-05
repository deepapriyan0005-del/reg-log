const express = require("express");
const multer = require("multer");

const {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getUserDetails,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  getLoginHistory
} = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();


// ================= TEST ROUTE =================

router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes working"
  });
});


// ================= IMAGE UPLOAD =================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage
});


// ================= REGISTER =================

router.post(
  "/register",
  upload.single("image"),
  registerUser
);


// ================= LOGIN =================

router.post(
  "/login",
  loginUser
);


router.post(
  "/forgot-password",
  forgotPassword
);


router.post(
  "/forgot-password/verify-otp",
  verifyForgotPasswordOtp
);

router.post(
  "/reset-password",
  resetPassword
);

// ================= VERIFY OTP =================

router.post(
  "/verify-otp",
  verifyOtp
);

// ================= RESEND OTP =================

router.post(
  "/resend-otp",
  resendOtp
);


// ================= USER DETAILS =================

router.get(
  "/user",
  verifyToken,
  getUserDetails
);

router.get(
  "/login-history",
  verifyToken,
  getLoginHistory
);

// ================= UPDATE USER =================

router.put(
  "/user",
  verifyToken,
  upload.single("image"),
  updateUser
);


// ================= DELETE USER =================

router.delete(
  "/user",
  verifyToken,
  deleteUser
);

router.put(
  "/change-password",
  verifyToken,
  changePassword
);


module.exports = router;


