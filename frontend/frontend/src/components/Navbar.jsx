import { Link, useNavigate } from "react-router-dom";

function Navbar({ setToken }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken(null);

    navigate("/login");
  };

  return (
    <nav>
      <h2>My App</h2>

      {!token ? (
        <>
          <Link to="/register">
            <button>Register</button>
          </Link>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      ) : (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
