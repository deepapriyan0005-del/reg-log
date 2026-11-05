import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDetails from "./pages/UserDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import LoginHistory from "./pages/LoginHistory";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  return (
    <>
      <BrowserRouter>

        <Navbar setToken={setToken} />

        <Routes>

          <Route
            path="/register"
            element={
              token ? <Navigate to="/user" replace /> : <Register />
            }
          />

          <Route
            path="/login"
            element={
              token ? <Navigate to="/user" replace /> : <Login />
            }
          />

          <Route
            path="/user"
            element={
              token ? <UserDetails /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/forgot-password"
            element={
              token ? <Navigate to="/user" replace /> : <ForgotPassword />
            }
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/change-password"
            element={
              token ? <ChangePassword /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login-history"
            element={
              token ? <LoginHistory /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to={token ? "/user" : "/login"}
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
