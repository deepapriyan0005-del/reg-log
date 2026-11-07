import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot Password page-ல இருந்து email வரும்
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
  toast.error("Please verify OTP first");
  navigate("/forgot-password");
  return;
}

    if (!password.trim()) {
      toast.error("Please enter new password");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Please confirm password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Password and Confirm Password do not match"
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must contain at least 6 characters"
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://reg-log-koz0.onrender.com/api/auth/reset-password",
        {
          email,
          password,
          confirmPassword
        }
      );

      console.log(
        "RESET PASSWORD RESPONSE:",
        response.data
      );

      toast.success(
        "Password reset successfully"
      );

      // Go to Login
      navigate("/login");

    } catch (error) {
      console.log(
        "RESET PASSWORD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Password reset failed"
      );
    }
  };

  return (
    <div className="container">

      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>

        {/* NEW PASSWORD */}

        <div className="form-group">

          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>

        {/* CONFIRM PASSWORD */}

        <div className="form-group">

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

        </div>

        <button
          className="submit-btn"
          type="submit"
        >
          Reset Password
        </button>

      </form>

    </div>
  );
}

export default ResetPassword;