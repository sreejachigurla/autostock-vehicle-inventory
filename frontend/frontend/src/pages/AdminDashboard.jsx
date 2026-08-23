import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const adminName =
    user.name ||
    user.username ||
    user.email ||
    "AutoStock Admin";

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data?.vehicles || []);
    } catch (err) {
      console.error(
        "Failed to load vehicles:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load vehicle inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const totalModels = vehicles.length;

  const totalStock = vehicles.reduce(
    (sum, vehicle) =>
      sum + Number(vehicle.quantity || 0),
    0
  );

  const inventoryValue = vehicles.reduce(
    (sum, vehicle) =>
      sum +
      Number(vehicle.price || 0) *
        Number(vehicle.quantity || 0),
    0
  );

  const lowStock = vehicles.filter((vehicle) => {
    const quantity = Number(vehicle.quantity || 0);
    return quantity > 0 && quantity <= 2;
  }).length;

  const outOfStock = vehicles.filter(
    (vehicle) =>
      Number(vehicle.quantity || 0) <= 0
  ).length;

  const availableModels = vehicles.filter(
    (vehicle) =>
      Number(vehicle.quantity || 0) > 0
  ).length;

  const getStockStatus = (quantity) => {
    const stock = Number(quantity || 0);

    if (stock <= 0) {
      return {
        text: "Out of stock",
        className: "status-out",
      };
    }

    if (stock <= 2) {
      return {
        text: "Low stock",
        className: "status-low",
      };
    }

    return {
      text: "Available",
      className: "status-available",
    };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/");
  };

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="sidebar-brand">
          <div className="brand-logo">
            🚗
          </div>

          <div>
            <h2>AutoStock</h2>
            <p>Inventory System</p>
          </div>
        </div>

        <div className="sidebar-section-title">
          MANAGEMENT
        </div>

        <nav className="sidebar-navigation">

          <button
            className="sidebar-item active"
            onClick={() =>
              goTo("/admin-dashboard")
            }
          >
            <span className="sidebar-icon">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => goTo("/vehicles")}
          >
            <span className="sidebar-icon">▱</span>
            <span>Vehicles</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => goTo("/add-vehicle")}
          >
            <span className="sidebar-icon">＋</span>
            <span>Add Vehicle</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => goTo("/restock")}
          >
            <span className="sidebar-icon">↻</span>
            <span>Restock</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => goTo("/reports")}
          >
            <span className="sidebar-icon">⌁</span>
            <span>Reports</span>
          </button>

          <button
            className="sidebar-item"
            onClick={() => goTo("/users")}
          >
            <span className="sidebar-icon">♙</span>
            <span>Users</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-profile">

            <div className="profile-avatar">
              {adminName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-details">
              <strong>{adminName}</strong>
              <span>Administrator</span>
            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-content">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div className="breadcrumb">
            <span>Management</span>
            <b>/</b>
            <strong>Dashboard</strong>
          </div>

          <button
            className="top-refresh"
            onClick={fetchVehicles}
            title="Refresh inventory"
          >
            ↻
          </button>

          <div className="top-profile">

            <div className="top-avatar">
              {adminName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{adminName}</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>

        {/* PAGE INTRO */}

        <section className="dashboard-intro">

          <div>
            <span className="intro-label">
              OVERVIEW
            </span>

            <h1>
              Welcome back,{" "}
              <span>AutoStock</span>
            </h1>

            <p>
              Monitor your vehicle inventory, stock
              levels and dealership performance.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              goTo("/add-vehicle")
            }
          >
            <span>＋</span>
            Add Vehicle
          </button>

        </section>

        {/* ERROR */}

        {error && (
          <div className="dashboard-error">
            <span>⚠</span>

            <p>{error}</p>

            <button onClick={fetchVehicles}>
              Try Again
            </button>
          </div>
        )}

        {/* ================= STAT CARDS ================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-card-header">
              <div>
                <p>Total Vehicles</p>

                <h2>
                  {loading ? "—" : totalModels}
                </h2>
              </div>

              <div className="stat-icon stat-blue">
                🚘
              </div>
            </div>

            <div className="stat-footer">
              Vehicle models in inventory
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-card-header">
              <div>
                <p>Available Stock</p>

                <h2>
                  {loading ? "—" : totalStock}
                </h2>
              </div>

              <div className="stat-icon stat-green">
                📦
              </div>
            </div>

            <div className="stat-footer">
              Units currently available
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-card-header">
              <div>
                <p>Inventory Value</p>

                <h2 className="money-value">
                  {loading
                    ? "—"
                    : `₹${inventoryValue.toLocaleString(
                        "en-IN"
                      )}`}
                </h2>
              </div>

              <div className="stat-icon stat-purple">
                ₹
              </div>
            </div>

            <div className="stat-footer">
              Total inventory worth
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-card-header">
              <div>
                <p>Low Stock</p>

                <h2>
                  {loading ? "—" : lowStock}
                </h2>
              </div>

              <div className="stat-icon stat-orange">
                ⚠
              </div>
            </div>

            <div className="stat-footer">
              Vehicles needing attention
            </div>

          </div>

        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                ACTIONS
              </span>

              <h2>Quick Actions</h2>

              <p>
                Frequently used inventory tools
              </p>
            </div>

          </div>

          <div className="quick-actions">

            <button
              className="quick-action"
              onClick={() =>
                goTo("/add-vehicle")
              }
            >
              <div className="quick-icon purple">
                ＋
              </div>

              <div className="quick-content">
                <h3>Add Vehicle</h3>
                <p>
                  Add a new vehicle to inventory
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>
            </button>

            <button
              className="quick-action"
              onClick={() =>
                goTo("/vehicles")
              }
            >
              <div className="quick-icon blue">
                ▱
              </div>

              <div className="quick-content">
                <h3>Manage Vehicles</h3>
                <p>
                  View, edit and delete vehicles
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>
            </button>

            <button
              className="quick-action"
              onClick={() =>
                goTo("/restock")
              }
            >
              <div className="quick-icon green">
                ↻
              </div>

              <div className="quick-content">
                <h3>Restock Vehicles</h3>
                <p>
                  Increase available inventory
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>
            </button>

            <button
              className="quick-action"
              onClick={() =>
                goTo("/reports")
              }
            >
              <div className="quick-icon orange">
                ⌁
              </div>

              <div className="quick-content">
                <h3>View Reports</h3>
                <p>
                  Analyze inventory performance
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>
            </button>

          </div>

        </section>

        {/* ================= RECENT INVENTORY ================= */}

        <section className="dashboard-section inventory-section">

          <div className="section-heading inventory-heading">

            <div>
              <span className="section-label">
                INVENTORY
              </span>

              <h2>Recent Inventory</h2>

              <p>
                Latest vehicles in your dealership
              </p>
            </div>

            <button
              className="view-all"
              onClick={() =>
                goTo("/vehicles")
              }
            >
              View all →
            </button>

          </div>

          <div className="inventory-table-container">

            {loading ? (

              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading inventory...</p>
              </div>

            ) : vehicles.length === 0 ? (

              <div className="empty-inventory">

                <div className="empty-icon">
                  🚘
                </div>

                <h3>No vehicles yet</h3>

                <p>
                  Add your first vehicle to get
                  started.
                </p>

                <button
                  onClick={() =>
                    goTo("/add-vehicle")
                  }
                >
                  ＋ Add Vehicle
                </button>

              </div>

            ) : (

              <div className="table-scroll">

                <table className="inventory-table">

                  <thead>
                    <tr>
                      <th>VEHICLE</th>
                      <th>CATEGORY</th>
                      <th>PRICE</th>
                      <th>STOCK</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>

                    {vehicles
                      .slice(0, 5)
                      .map((vehicle) => {

                        const status =
                          getStockStatus(
                            vehicle.quantity
                          );

                        return (
                          <tr
                            key={vehicle._id}
                          >

                            <td>
                              <div className="vehicle-cell">

                                <div className="vehicle-thumbnail">
                                  🚘
                                </div>

                                <div>
                                  <strong>
                                    {vehicle.make}{" "}
                                    {vehicle.model}
                                  </strong>

                                  <span>
                                    ID:{" "}
                                    {String(
                                      vehicle._id
                                    ).slice(0, 8)}
                                  </span>
                                </div>

                              </div>
                            </td>

                            <td>
                              <span className="category-badge">
                                {vehicle.category ||
                                  "Vehicle"}
                              </span>
                            </td>

                            <td>
                              <strong className="price">
                                ₹
                                {Number(
                                  vehicle.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>
                            </td>

                            <td>
                              <strong className="stock-number">
                                {Number(
                                  vehicle.quantity || 0
                                )}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`stock-status ${status.className}`}
                              >
                                <span></span>
                                {status.text}
                              </span>
                            </td>

                          </tr>
                        );
                      })}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>

        {/* ================= BOTTOM OVERVIEW ================= */}

        <section className="bottom-overview">

          <div className="mini-summary">

            <div className="mini-summary-icon blue">
              ▱
            </div>

            <div>
              <span>Available Models</span>
              <strong>
                {loading
                  ? "—"
                  : availableModels}
              </strong>
              <small>
                Models currently in stock
              </small>
            </div>

          </div>

          <div className="mini-summary">

            <div className="mini-summary-icon orange">
              !
            </div>

            <div>
              <span>Out of Stock</span>
              <strong>
                {loading
                  ? "—"
                  : outOfStock}
              </strong>
              <small>
                Models requiring restock
              </small>
            </div>

          </div>

          <div className="smart-card">

            <div className="smart-icon">
              ✦
            </div>

            <div className="smart-content">
              <span>SMART INSIGHTS</span>

              <h3>
                AI Inventory Assistant
              </h3>

              <p>
                Get intelligent inventory
                recommendations and insights.
              </p>
            </div>

            <button
              onClick={() =>
                goTo("/ai-assistant")
              }
            >
              Open →
            </button>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="admin-footer">
          <span>© 2026 AutoStock</span>

          <span>
            Vehicle Inventory Management System
          </span>

          <span className="footer-secure">
            ✓ Secure Admin Portal
          </span>
        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;