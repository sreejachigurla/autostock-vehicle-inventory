import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // LOAD USER + VEHICLES
  // ==============================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Get logged-in user
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("User data error:", error);
          }
        }

        // Get vehicles
        const token = localStorage.getItem("token");

        const response = await api.get("/vehicles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVehicles(response.data.vehicles || []);

      } catch (error) {
        console.error(
          "Dashboard error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==============================
  // USER NAME
  // ==============================

  const displayName =
    user?.name ||
    user?.username ||
    "User";

  // ==============================
  // TOTAL AVAILABLE VEHICLES
  // ==============================

  const totalAvailable = vehicles.reduce(
    (total, vehicle) =>
      total + Number(vehicle.quantity || 0),
    0
  );

  // ==============================
  // DYNAMIC CATEGORY ICONS
  // ==============================

  const categoryIcons = {
    SUV: "🚙",
    Sedan: "🚗",
    Sports: "🏎️",
    MUV: "🚐",
    Electric: "⚡",
    Hatchback: "🚘",
    Luxury: "✨",
    Truck: "🚚",
    Van: "🚐",
    Bike: "🏍️",
  };

  // ==============================
  // CREATE UNIQUE CATEGORIES
  // FROM DATABASE
  // ==============================

  const categoryMap = {};

  vehicles.forEach((vehicle) => {
    const category = vehicle.category?.trim();

    if (!category) {
      return;
    }

    if (!categoryMap[category]) {
      categoryMap[category] = {
        name: category,
        count: 0,
        vehicles: 0,
      };
    }

    categoryMap[category].count += Number(
      vehicle.quantity || 0
    );

    categoryMap[category].vehicles += 1;
  });

  const categories = Object.values(categoryMap);

  // ==============================
  // FEATURED VEHICLES
  // ==============================

  const featuredVehicles = vehicles
    .filter(
      (vehicle) =>
        Number(vehicle.quantity || 0) > 0
    )
    .slice(0, 3);

  // ==============================
  // FORMAT PRICE
  // ==============================

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="user-dashboard-loading">

        <div className="dashboard-loading-logo">
          🚗
        </div>

        <div className="dashboard-spinner"></div>

        <h2>Loading Showroom...</h2>

        <p>
          Preparing your vehicle dashboard
        </p>

      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="user-dashboard">

      {/* =================================
          HEADER
      ================================= */}

      <header className="user-dashboard-header">

        <div className="dashboard-brand">

          <div className="dashboard-logo">
            🚗
          </div>

          <div>
            <h2>Vehicle Management</h2>
            <span>Car Showroom</span>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="dashboard-navigation">

          <button
            onClick={() =>
              navigate("/user-vehicles")
            }
          >
            Browse Cars
          </button>

          <button
            onClick={() =>
              navigate("/my-vehicles")
            }
          >
            My Vehicles
          </button>

          <button
            onClick={() =>
              navigate("/purchase-history")
            }
          >
            Purchase History
          </button>

          <button
            onClick={() =>
              navigate("/profile")
            }
          >
            Profile
          </button>

        </nav>


        {/* USER */}

        <div className="dashboard-user-area">

          <div className="dashboard-user-info">

            <div className="dashboard-avatar">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {displayName}
              </strong>

              <span>
                {user?.email ||
                  "User"}
              </span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================
          MAIN
      ================================= */}

      <main className="user-dashboard-main">


        {/* =================================
            HERO
        ================================= */}

        <section className="showroom-hero">

          <div className="hero-content">

            <span className="hero-badge">
              🚘 PREMIUM VEHICLE SHOWROOM
            </span>

            <h1>
              Find the car that
              <span> fits your journey.</span>
            </h1>

            <p>
              Explore quality vehicles,
              compare prices and find the
              perfect car for your lifestyle.
            </p>

            <div className="hero-buttons">

              <button
                className="hero-primary-button"
                onClick={() =>
                  navigate("/user-vehicles")
                }
              >
                🔍 Browse Vehicles
              </button>

              <button
                className="hero-secondary-button"
                onClick={() =>
                  navigate("/my-vehicles")
                }
              >
                🚗 My Vehicles
              </button>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="hero-glow"></div>

            <div className="hero-car">
              🚘
            </div>

            <div className="hero-floating-card">

              <span>
                AVAILABLE NOW
              </span>

              <strong>
                {totalAvailable}
              </strong>

              <small>
                Vehicles in stock
              </small>

            </div>

          </div>

        </section>


        {/* =================================
            ERROR
        ================================= */}

        {error && (
          <div className="dashboard-error">
            ⚠️ {error}
          </div>
        )}


        {/* =================================
            STATISTICS
        ================================= */}

        <section className="dashboard-statistics">

          <div className="dashboard-stat-card">

            <div className="stat-icon blue">
              🚘
            </div>

            <div>
              <span>
                Available Cars
              </span>

              <strong>
                {totalAvailable}
              </strong>

              <small>
                Vehicles in stock
              </small>
            </div>

          </div>


          <div
            className="dashboard-stat-card clickable"
            onClick={() =>
              navigate("/my-vehicles")
            }
          >

            <div className="stat-icon green">
              🛒
            </div>

            <div>
              <span>
                My Vehicles
              </span>

              <strong>
                View
              </strong>

              <small>
                Your purchased cars
              </small>
            </div>

          </div>


          <div
            className="dashboard-stat-card clickable"
            onClick={() =>
              navigate("/purchase-history")
            }
          >

            <div className="stat-icon purple">
              🧾
            </div>

            <div>
              <span>
                Purchase History
              </span>

              <strong>
                View
              </strong>

              <small>
                Previous purchases
              </small>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon orange">
              🔐
            </div>

            <div>
              <span>
                Account
              </span>

              <strong>
                Active
              </strong>

              <small>
                Account status
              </small>
            </div>

          </div>

        </section>


        {/* =================================
            CATEGORIES
        ================================= */}

        <section className="category-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                EXPLORE
              </span>

              <h2>
                Browse by Category
              </h2>

              <p>
                Find a vehicle that matches
                your needs.
              </p>

            </div>

            <button
              className="section-view-button"
              onClick={() =>
                navigate("/user-vehicles")
              }
            >
              View All →
            </button>

          </div>


          {categories.length === 0 ? (

            <div className="empty-category">
              <span>🚘</span>

              <h3>
                No categories available
              </h3>

              <p>
                Vehicles will appear here
                once they are added.
              </p>
            </div>

          ) : (

            <div className="category-grid">

              {categories.map((category) => (

                <div
                  className="category-card"
                  key={category.name}
                  onClick={() =>
                    navigate(
                      `/user-vehicles?category=${encodeURIComponent(
                        category.name
                      )}`
                    )
                  }
                >

                  <div className="category-icon">
                    {categoryIcons[
                      category.name
                    ] || "🚘"}
                  </div>

                  <div className="category-details">

                    <h3>
                      {category.name}
                    </h3>

                    <p>
                      {category.count}{" "}
                      available
                    </p>

                  </div>

                  <span className="category-arrow">
                    →
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =================================
            FEATURED VEHICLES
        ================================= */}

        <section className="featured-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                VEHICLE INVENTORY
              </span>

              <h2>
                Featured Vehicles
              </h2>

              <p>
                Popular vehicles currently
                available for purchase.
              </p>

            </div>

            <button
              className="section-view-button"
              onClick={() =>
                navigate("/user-vehicles")
              }
            >
              View All →
            </button>

          </div>


          {featuredVehicles.length === 0 ? (

            <div className="empty-vehicles">

              <span>🚗</span>

              <h3>
                No vehicles available
              </h3>

              <p>
                Please check again later.
              </p>

            </div>

          ) : (

            <div className="featured-grid">

              {featuredVehicles.map(
                (vehicle) => {

                  const quantity =
                    Number(
                      vehicle.quantity || 0
                    );

                  return (

                    <div
                      className="featured-card"
                      key={vehicle._id}
                    >

                      {/* IMAGE */}

                      <div className="featured-image">

                        {vehicle.image ? (

                          <img
                            src={vehicle.image}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                              e.currentTarget.parentElement
                                .querySelector(
                                  ".image-fallback"
                                )
                                .style.display =
                                "flex";
                            }}
                          />

                        ) : null}

                        <div
                          className="image-fallback"
                          style={{
                            display:
                              vehicle.image
                                ? "none"
                                : "flex",
                          }}
                        >
                          🚗
                        </div>

                        <span className="featured-stock">
                          {quantity} Available
                        </span>

                      </div>


                      {/* DETAILS */}

                      <div className="featured-content">

                        <span className="vehicle-category">
                          {vehicle.category ||
                            "Vehicle"}
                        </span>

                        <h3>
                          {vehicle.make}{" "}
                          {vehicle.model}
                        </h3>

                        <div className="featured-bottom">

                          <strong>
                            {formatPrice(
                              vehicle.price
                            )}
                          </strong>

                          <button
                            onClick={() =>
                              navigate(
                                `/user-vehicles?search=${encodeURIComponent(
                                  `${vehicle.make} ${vehicle.model}`
                                )}`
                              )
                            }
                          >
                            View Details →
                          </button>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =================================
            CALL TO ACTION
        ================================= */}

        <section className="dashboard-cta">

          <div>

            <span>
              READY FOR YOUR NEXT JOURNEY?
            </span>

            <h2>
              Find your perfect car today.
            </h2>

            <p>
              Browse our complete collection
              and discover a vehicle that fits
              your lifestyle.
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/user-vehicles")
            }
          >
            Explore All Cars →
          </button>

        </section>


        {/* =================================
            ACCOUNT
        ================================= */}

        <section className="account-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                ACCOUNT
              </span>

              <h2>
                Your Account
              </h2>

            </div>

            <button
              className="section-view-button"
              onClick={() =>
                navigate("/profile")
              }
            >
              View Profile →
            </button>

          </div>


          <div className="account-grid">

            <div className="account-item">

              <span>
                Name
              </span>

              <strong>
                {displayName}
              </strong>

            </div>


            <div className="account-item">

              <span>
                Email
              </span>

              <strong>
                {user?.email ||
                  "Not available"}
              </strong>

            </div>


            <div className="account-item">

              <span>
                Role
              </span>

              <strong>
                {user?.role ||
                  "user"}
              </strong>

            </div>


            <div className="account-item">

              <span>
                Status
              </span>

              <strong className="active-text">
                ● Active
              </strong>

            </div>

          </div>

        </section>

      </main>


      {/* =================================
          FOOTER
      ================================= */}

      <footer className="dashboard-footer">

        <div>
          🚗 <strong>Vehicle Management</strong>
        </div>

        <span>
          Your journey starts here.
        </span>

      </footer>

    </div>
  );
}

export default UserDashboard;