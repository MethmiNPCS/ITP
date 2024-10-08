import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    gmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await sendRequest();
      if (response.status === "ok") {
        alert("Login successful");
        navigate("/home");
      } else {
        alert("Login error: " + response.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const sendRequest = async () => {
    return await axios
      .post("http://localhost:5000/login", {
        gmail: user.gmail,
        password: user.password,
      })
      .then((res) => res.data);
  };

  const handleRegisterClick = () => {
    navigate("/register"); // Navigate to register page when clicked
  };

  return (
    <div>
        <br></br>
      <center>
        <h1>User Login</h1>
      </center>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="register-button">Login</button>

    <br></br>
          <button
            type="button"
            className="register-button"
            style={{ marginTop: "10px" }}
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
