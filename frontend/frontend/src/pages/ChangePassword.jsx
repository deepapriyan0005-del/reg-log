import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check current password
    if (!currentPassword.trim()) {
      toast.error("Please enter current password");
      return;
    }

    // 2. Check new password
    if (!newPassword.trim()) {
      toast.error("Please enter new password");
      return;
    }

    // 3. Check confirm password
    if (!confirmPassword.trim()) {
      toast.error("Please confirm new password");
      return;
    }

    // 4. Check password match
    if (newPassword !== confirmPassword) {
      toast.error(
        "New Password and Confirm Password do not match"
      );
      return;
    }

    // 5. Check password length
    if (newPassword.length < 6) {
      toast.error(
        "New password must contain at least 6 characters"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "https://reg-log-koz0.onrender.com/api/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "CHANGE PASSWORD RESPONSE:",
        response.data
      );

      toast.success(
        "Password changed successfully"
      );

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Go back to user page
      navigate("/user");

    } catch (error) {
      console.log(
        "CHANGE PASSWORD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to change password"
      );
    }
  };

  return (
    <div className="container">

      <button
      type="button"
      onClick={() => navigate("/user")}
      className="back-btn"
    >
      ← Back to User Page
    </button>


      <h1>Change Password</h1>

      <form onSubmit={handleSubmit}>

        {/* Current Password */}
        <div className="form-group">
          <label>Current Password</label>

          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
          />
        </div>

        {/* New Password */}
        <div className="form-group">
          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm New Password</label>

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
          Change Password
        </button>

      </form>

    </div>
  );
}

export default ChangePassword;