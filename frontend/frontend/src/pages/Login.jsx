import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Login response:", response.data);

      const token =
        response.data.token ||
        response.data.accessToken;

      if (!token) {
        setError("Login successful but token was not received");
        return;
      }

      // Save token
      localStorage.setItem("token", token);

      // Get user
      const user = response.data.user;

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // Get role
      const role = String(
        user?.role || "user"
      ).toLowerCase();

      console.log("Logged in role:", role);

      // ADMIN
      if (role === "admin" || role === "administrator") {
        navigate("/admin-dashboard");
        return;
      }

      // NORMAL USER
      navigate("/user-dashboard");

    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-logo">
            🚗
          </div>

          <h1>
            Vehicle Management
          </h1>

          <p>
            Manage vehicles, users and
            system operations easily.
          </p>

        </div>


        {/* LOGIN FORM */}

        <div className="login-form-section">

          <div className="login-heading">

            <h2>
              Welcome Back
            </h2>

            <p>
              Login to your account
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>


          {/* REGISTER */}

          <div className="register-section">

            <p>
              Don't have an account?
            </p>

            <button
              type="button"
              className="register-button"
              onClick={() => navigate("/register")}
            >
              Create an Account
            </button>

          </div>


          <div className="login-footer">

            <span>
              Vehicle Management System
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;