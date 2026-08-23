import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      alert(
        response.data.message ||
        "Registration successful!"
      );

      navigate("/login");

    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-brand">

          <div className="register-logo">
            🚗
          </div>

          <h1>
            Vehicle Management
          </h1>

          <p>
            Create your account and manage
            your vehicles easily.
          </p>

        </div>

        <div className="register-form-section">

          <div className="register-heading">
            <h2>Create Account</h2>

            <p>
              Register for a new account
            </p>
          </div>

          {error && (
            <div className="register-error">
              ⚠️ {error}
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            <div className="register-group">

              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />

            </div>

            <div className="register-group">

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
                disabled={loading}
              />

            </div>

            <div className="register-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="register-footer">

            Already have an account?

            <button
              className="register-login-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;