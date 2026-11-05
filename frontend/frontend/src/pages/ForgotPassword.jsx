import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // OTP page show/hide
  const [showOtp, setShowOtp] = useState(false);

  // ================= SEND OTP =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/auth/forgot-password",
        {
          email
        }
      );

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        response.data
      );

      // Show OTP input
      setShowOtp(true);

      toast.success(
  "OTP sent successfully. Please check your email."
);

    } catch (error) {
      console.log(
        "FORGOT PASSWORD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Forgot password failed"
      );
    }
  };

  // ================= VERIFY OTP =================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/auth/forgot-password/verify-otp",
        {
          email,
          otp
        }
      );

      console.log(
        "FORGOT OTP RESPONSE:",
        response.data
      );

      toast.success(
        "OTP verified successfully"
      );

      // Next step
      // Reset Password page
      navigate("/reset-password", {
        state: {
          email
        }
      });

    } catch (error) {
      console.log(
        "FORGOT OTP ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Invalid OTP"
      );
    }
  };

  return (
    <div className="container">

      <h1>Forgot Password</h1>

      {/* ================= EMAIL FORM ================= */}

      {!showOtp && (
        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <button
            className="submit-btn"
            type="submit"
          >
            Send OTP
          </button>

        </form>
      )}

      {/* ================= OTP FORM ================= */}

      {showOtp && (
        <form onSubmit={handleVerifyOtp}>

          <div className="form-group">

            <label>Enter OTP</label>

            <input
              type="text"
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              maxLength="6"
            />

          </div>

          <button
            className="submit-btn"
            type="submit"
          >
            Verify OTP
          </button>

        </form>
      )}

      {/* ================= LOGIN ================= */}

      <p>

        Remember your password?{" "}

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
        >
          Login
        </button>

      </p>

    </div>
  );
}

export default ForgotPassword;