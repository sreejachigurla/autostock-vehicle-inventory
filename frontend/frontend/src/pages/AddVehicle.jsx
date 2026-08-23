import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./UserVehicles.css";

function UserVehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [purchasingId, setPurchasingId] = useState(null);

  // ==============================
  // GET VEHICLES
  // ==============================

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error(
        "Vehicle error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load vehicles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ==============================
  // PURCHASE VEHICLE
  // ==============================

  const handlePurchase = async (vehicleId) => {
    try {
      setPurchasingId(vehicleId);

      const token = localStorage.getItem("token");

      const response = await api.post(
        `/vehicles/${vehicleId}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Vehicle purchased successfully"
      );

      await fetchVehicles();
    } catch (error) {
      console.error(
        "Purchase error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to purchase vehicle"
      );
    } finally {
      setPurchasingId(null);
    }
  };

  // ==============================
  // FILTER
  // ==============================

  const categories = [
    "All",
    ...new Set(
      vehicles
        .map((vehicle) => vehicle.category)
        .filter(Boolean)
    ),
  ];

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      String(vehicle.make || "")
        .toLowerCase()
        .includes(searchText) ||
      String(vehicle.model || "")
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "All" ||
      vehicle.category === category;

    return matchesSearch && matchesCategory;
  });

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="user-vehicles-loading">
        <div className="user-vehicle-spinner"></div>

        <h2>Loading Vehicles...</h2>

        <p>
          Please wait while vehicles are loading.
        </p>
      </div>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="user-vehicles-page">

      {/* HEADER */}

      <header className="user-vehicles-header">

        <div className="user-vehicles-brand">

          <div className="user-vehicles-logo">
            🚗
          </div>

          <div>
            <h2>Vehicle Management</h2>
            <span>User Vehicles</span>
          </div>

        </div>

        <button
          className="user-vehicles-back"
          onClick={() =>
            navigate("/user-dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>

      {/* MAIN */}

      <main className="user-vehicles-main">

        {/* INTRO */}

        <section className="user-vehicles-intro">

          <div>
            <p className="user-vehicles-eyebrow">
              VEHICLE INVENTORY
            </p>

            <h1>Available Vehicles</h1>

            <p>
              Browse available vehicles and
              purchase the vehicle you need.
            </p>
          </div>

          <button
            className="user-vehicles-refresh"
            onClick={fetchVehicles}
          >
            🔄 Refresh
          </button>

        </section>

        {/* FILTERS */}

        <section className="user-vehicles-filters">

          <div className="user-vehicles-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by make or model..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item === "All"
                  ? "All Categories"
                  : item}
              </option>
            ))}
          </select>

        </section>

        {/* ERROR */}

        {error && (
          <div className="user-vehicles-error">

            ⚠️ {error}

            <button onClick={fetchVehicles}>
              Try Again
            </button>

          </div>
        )}

        {/* VEHICLES */}

        {filteredVehicles.length === 0 ? (

          <div className="user-no-vehicles">

            <div>🚗</div>

            <h2>No vehicles found</h2>

            <p>
              Try changing your search or
              category filter.
            </p>

          </div>

        ) : (

          <section className="user-vehicle-grid">

            {filteredVehicles.map((vehicle) => {

              const quantity =
                Number(vehicle.quantity || 0);

              const outOfStock =
                quantity <= 0;

              const purchasing =
                purchasingId === vehicle._id;

              return (
                <div
                  className="user-vehicle-card"
                  key={vehicle._id}
                >

                  <div className="user-vehicle-top">

                    <div className="user-vehicle-icon">
                      🚗
                    </div>

                    <span
                      className={
                        outOfStock
                          ? "user-stock out"
                          : "user-stock"
                      }
                    >
                      {outOfStock
                        ? "Out of Stock"
                        : `${quantity} Available`}
                    </span>

                  </div>

                  <div className="user-vehicle-info">

                    <span>
                      {vehicle.category ||
                        "Vehicle"}
                    </span>

                    <h2>
                      {vehicle.make}{" "}
                      {vehicle.model}
                    </h2>

                    <strong>
                      ₹
                      {Number(
                        vehicle.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                  <div className="user-vehicle-details">

                    <div>
                      <span>Make</span>
                      <strong>
                        {vehicle.make || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Model</span>
                      <strong>
                        {vehicle.model || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Category</span>
                      <strong>
                        {vehicle.category || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Stock</span>
                      <strong>
                        {quantity}
                      </strong>
                    </div>

                  </div>

                  <button
                    className="user-purchase-button"
                    disabled={
                      outOfStock ||
                      purchasing
                    }
                    onClick={() =>
                      handlePurchase(
                        vehicle._id
                      )
                    }
                  >
                    {purchasing
                      ? "Purchasing..."
                      : outOfStock
                      ? "Out of Stock"
                      : "🛒 Purchase Vehicle"}
                  </button>

                </div>
              );
            })}

          </section>
        )}

      </main>

    </div>
  );
}

export default UserVehicles;