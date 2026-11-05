const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const LoginHistory = require("../models/loginHistoryModel");
const sendOtpEmail = require("../utils/emailService");

// Temporary OTP storage
const otpStore = new Map();
const resetVerified = new Map();


// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      password,
      confirmPassword
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !age ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password do not match"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: hashedPassword,
      image: req.file ? req.file.filename : ""
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};


// ================= LOGIN =================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate 6 digit OTP
    const otp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    // Store OTP for 1 minute
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 1 * 60 * 1000
    });

    // Send OTP to user's email
    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message
    });
  }
};


// ================= VERIFY OTP =================

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({
        message: "OTP not found. Please login again"
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);

      return res.status(400).json({
        message: "OTP expired. Please login again"
      });
    }

    // Check OTP
    if (otp !== storedData.otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // OTP correct -> create JWT
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // Save Login History
await LoginHistory.create({
  userId: user._id,
  status: "Success",
  loginAt: new Date()
});

console.log("Login history saved successfully");

    // OTP used -> remove it
    otpStore.delete(email);

    res.status(200).json({
      message: "OTP verified successfully",
      token: token
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "OTP verification failed",
      error: error.message
    });
  }
};

// ================= RESEND OTP =================

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    // Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Generate new 6 digit OTP
    const otp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    // Store new OTP for 5 minutes
    otpStore.set(email, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // Dummy OTP for learning
    console.log("New Dummy OTP:", otp);

    res.status(200).json({
      message: "New OTP generated successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to resend OTP",
      error: error.message
    });
  }
};


// ================= USER DETAILS =================

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
      error: error.message
    });
  }
};

// ================= UPDATE USER =================

// ================= UPDATE USER =================

const updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      age,
      gender
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      age,
      gender
    };

    // New image uploaded?
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update user",
      error: error.message
    });
  }
};


// ================= DELETE USER =================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
};




  // ================= FORGOT PASSWORD =================


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email not registered"
      });
    }

    // Generate 6 digit OTP
    const otp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    // Store OTP for 5 minutes
    otpStore.set(`forgot-${email}`, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // Send OTP to registered email
    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "Password reset OTP sent to your email"
    });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Failed to send password reset OTP",
      error: error.message
    });
  }
};


const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    // 1. Check all fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 2. Check new password and confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New Password and Confirm Password do not match"
      });
    }

    // 3. Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must contain at least 6 characters"
      });
    }

    // 4. Find currently logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 5. Compare current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    // 6. Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // 7. Update password
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to change password",
      error: error.message
    });
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    // Get forgot password OTP
    const storedData = otpStore.get(`forgot-${email}`);

    if (!storedData) {
      return res.status(400).json({
        message: "OTP not found. Please request OTP again"
      });
    }

    // Check OTP expiry
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(`forgot-${email}`);

      return res.status(400).json({
        message: "OTP expired. Please request OTP again"
      });
    }

    // Check OTP
    if (otp !== storedData.otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // OTP correct
otpStore.delete(`forgot-${email}`);

// Allow password reset for 5 minutes
resetVerified.set(email, Date.now() + 5 * 60 * 1000);

    res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "OTP verification failed",
      error: error.message
    });
  }
};

// ================= RESET PASSWORD =================

const resetPassword = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword
    } = req.body;

    // Check all fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check OTP verification
const verifiedUntil = resetVerified.get(email);

if (!verifiedUntil || Date.now() > verifiedUntil) {
  return res.status(400).json({
    message: "Please verify OTP before resetting password"
  });
}

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password do not match"
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Update password
    user.password = hashedPassword;

    await user.save();
    resetVerified.delete(email);

    res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Password reset failed",
      error: error.message
    });
  }
};

const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find({
      userId: req.userId
    }).sort({
      loginAt: -1
    });

    res.status(200).json({
      history
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get login history",
      error: error.message
    });
  }
};


module.exports = {
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

};