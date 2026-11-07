import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  const getLoginHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://reg-log-backend.onrender.com/api/auth/login-history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "LOGIN HISTORY:",
        response.data
      );

      setHistory(response.data.history);
    } catch (error) {
      console.log(
        "LOGIN HISTORY ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to get login history"
      );
    }
  };

  useEffect(() => {
    getLoginHistory();
  }, []);

  return (
    <div className="container">
      <h1>Login History</h1>

      {history.length === 0 ? (
        <p>No login history found</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Login Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>

                <td>
                  {new Date(
                    item.loginAt
                  ).toLocaleString()}
                </td>

                <td>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />

      <button
        onClick={() => navigate("/user")}
      >
        Back to User Details
      </button>
    </div>
  );
}

export default LoginHistory;