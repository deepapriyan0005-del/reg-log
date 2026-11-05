import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  // ================= LOGIN STATES =================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= OTP STATES =================

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  // 1 minutes = 60 seconds
  const [timeLeft, setTimeLeft] = useState(60);

  // ================= LOGIN =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/auth/login",
        {
          email,
          password
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      // Show OTP page
      setShowOtp(true);

      // Start timer from 5 minutes
      setTimeLeft(60);

      toast.success(
        "OTP generated. Check backend terminal"
      );

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  // ================= OTP TIMER =================

  useEffect(() => {
    // OTP page open illa na timer run aaga koodathu
    if (!showOtp || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    // Component cleanup
    return () => clearInterval(timer);

  }, [showOtp, timeLeft]);

  // ================= RESEND OTP =================

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9000/api/auth/resend-otp",
        {
          email
        }
      );

      console.log(
        "RESEND OTP RESPONSE:",
        response.data
      );

      // Old OTP clear
      setOtp("");

      // New OTP gets 1 minutes
      setTimeLeft(60);

      toast.success(
        "New OTP generated. Check backend terminal"
      );

    } catch (error) {
      console.log(
        "RESEND OTP ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to resend OTP"
      );
    }
  };

  // ================= VERIFY OTP =================

  const handleOtpSubmit = async (e) => {

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/auth/verify-otp",
        {
          email,
          otp
        }
      );

      console.log(
        "OTP RESPONSE:",
        response.data
      );

      // Get JWT token
      const token = response.data.token;

      // Save token in browser
      localStorage.setItem("token", token);

      toast.success(
        "OTP verified successfully"
      );

      // Go to User Details page
      navigate("/user");

    } catch (error) {
      console.log(
        "OTP ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "OTP verification failed"
      );
    }
  };

  // ================= LOGIN PAGE =================

  return (
    <div className="container">

      <h1>Login</h1>

      {/* ================= LOGIN FORM ================= */}

      {!showOtp && (
        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>

          <button
            className="submit-btn"
            type="submit"
          >
            Login
          </button>

        </form>
      )}

      {/* ================= OTP FORM ================= */}

      {showOtp && (
        <form onSubmit={handleOtpSubmit}>

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

          {/* ================= TIMER ================= */}

          <p>
            OTP expires in:{" "}

            {String(
              Math.floor(timeLeft / 60)
            ).padStart(2, "0")}

            :

            {String(
              timeLeft % 60
            ).padStart(2, "0")}

          </p>

          {/* ================= VERIFY BUTTON ================= */}

          <button
            className="submit-btn"
            type="submit"
          >
            Verify OTP
          </button>

          {/* ================= RESEND BUTTON ================= */}

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={timeLeft > 0}
          >
            Resend OTP
          </button>

        </form>
      )}

      {/* ================= REGISTER ================= */}

      {!showOtp && (
        <p>

          New user?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </button>

        </p>
      )}

    </div>
  );
}

export default Login;