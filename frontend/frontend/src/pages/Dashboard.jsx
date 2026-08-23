import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          🚘 <span>AutoStock</span>
        </div>

        <nav>
          <button className="nav-item active">
            📊 Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/vehicles")}
          >
            🚗 Vehicles
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/add-vehicle")}
          >
            ➕ Add Vehicle
          </button>
        </nav>

        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Top Bar */}
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your inventory management system.</p>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Admin</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div>
              <p>Total Vehicles</p>
              <h2>--</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <p>Available</p>
              <h2>--</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div>
              <p>Inventory Value</p>
              <h2>₹ --</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <p>Stock Units</p>
              <h2>--</h2>
            </div>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your dealership inventory</p>
            </div>
          </div>

          <div className="action-grid">

            <button
              className="action-card"
              onClick={() => navigate("/vehicles")}
            >
              <span className="action-icon">🚗</span>
              <div>
                <h3>View Vehicles</h3>
                <p>Browse your complete inventory</p>
              </div>
              <span className="arrow">→</span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/add-vehicle")}
            >
              <span className="action-icon">➕</span>
              <div>
                <h3>Add Vehicle</h3>
                <p>Add a new vehicle to inventory</p>
              </div>
              <span className="arrow">→</span>
            </button>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;