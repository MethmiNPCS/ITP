
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Ensure this file is linked

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    gmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on change
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(user.gmail)) {
      newErrors.gmail = "Invalid email format";
    }
    if (!validatePassword(user.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return; // Stop if there are validation errors
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        name: user.name,
        gmail: user.gmail,
        password: user.password,
      });
      if (response.data.status === "ok") {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div><br />
      <center>
        <h1>User Register</h1>
      </center>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={user.name}
              onChange={handleInputChange}
              name="name"
              required
            />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="email"
              value={user.gmail}
              onChange={handleInputChange}
              name="gmail"
              required
            />
            {errors.gmail && <span className="error">{errors.gmail}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={user.password}
              onChange={handleInputChange}
              name="password"
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
}
