import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  // ================= PASSWORD STRENGTH =================

  const getPasswordStrength = (password) => {
    if (!password) {
      return "";
    }

    let score = 0;

    // Length
    if (password.length >= 6) {
      score++;
    }

    // Lowercase
    if (/[a-z]/.test(password)) {
      score++;
    }

    // Uppercase
    if (/[A-Z]/.test(password)) {
      score++;
    }

    // Number
    if (/[0-9]/.test(password)) {
      score++;
    }

    // Special character
    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    if (score <= 2) {
      return "Weak";
    }

    if (score <= 4) {
      return "Medium";
    }

    return "Strong";
  };

  const passwordStrength = getPasswordStrength(
    formData.password
  );

  // ================= REGISTER =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("REGISTER BUTTON CLICKED");

    // Check all fields
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.age ||
      !formData.gender ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.image
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // Password match
    if (formData.password !== formData.confirmPassword) {
      toast.error(
        "Password and Confirm Password do not match"
      );
      return;
    }

    // Password length
    if (formData.password.length < 6) {
      toast.error(
        "Password must contain at least 6 characters"
      );
      return;
    }

    try {
      const data = new FormData();

      data.append(
        "firstName",
        formData.firstName
      );

      data.append(
        "lastName",
        formData.lastName
      );

      data.append(
        "email",
        formData.email
      );

      data.append(
        "age",
        formData.age
      );

      data.append(
        "gender",
        formData.gender
      );

      data.append(
        "password",
        formData.password
      );

      data.append(
        "confirmPassword",
        formData.confirmPassword
      );

      data.append(
        "image",
        formData.image
      );

      console.log(
        "SENDING REGISTER REQUEST"
      );

      const response = await axios.post(
        "https://reg-log-koz0.onrender.com/api/auth/register",
        data
      );

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );

      toast.success(
        response.data.message
      );

      navigate("/login");

    } catch (error) {
      console.log(
        "REGISTER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="container">

      <h1>Register</h1>

      <form onSubmit={handleSubmit}>

        {/* FIRST NAME */}

        <div className="form-group">
          <label>First Name</label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>


        {/* LAST NAME */}

        <div className="form-group">
          <label>Last Name</label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>


        {/* EMAIL */}

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>


        {/* AGE */}

        <div className="form-group">
          <label>Age</label>

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            required
          />
        </div>


        {/* GENDER */}

        <div className="form-group">
          <label>Gender</label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>


        {/* PASSWORD */}

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />

          {/* PASSWORD STRENGTH */}

          {passwordStrength && (
            <p>
              Password Strength:{" "}

              <strong>
                {passwordStrength}
              </strong>
            </p>
          )}
        </div>


        {/* CONFIRM PASSWORD */}

        <div className="form-group">
          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>


        {/* PROFILE IMAGE */}

        <div className="form-group">
          <label>Profile Image</label>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>


        {/* REGISTER BUTTON */}

        <button
          className="submit-btn"
          type="submit"
        >
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;

