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
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

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
  // CATEGORIES
  // ==============================

  const categories = [
    "All",
    ...new Set(
      vehicles
        .map((vehicle) => vehicle.category)
        .filter(Boolean)
    ),
  ];

  // ==============================
  // FILTER + SEARCH + SORT
  // ==============================

  const filteredVehicles = vehicles
    .filter((vehicle) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const make = String(
        vehicle.make || ""
      ).toLowerCase();

      const model = String(
        vehicle.model || ""
      ).toLowerCase();

      const vehicleCategory = String(
        vehicle.category || ""
      ).toLowerCase();

      const matchesSearch =
        make.includes(searchText) ||
        model.includes(searchText) ||
        vehicleCategory.includes(searchText);

      const matchesCategory =
        category === "All" ||
        vehicle.category === category;

      const price = Number(
        vehicle.price || 0
      );

      let matchesPrice = true;

      if (priceRange === "under10") {
        matchesPrice = price < 1000000;
      }

      if (priceRange === "10to20") {
        matchesPrice =
          price >= 1000000 &&
          price <= 2000000;
      }

      if (priceRange === "20to30") {
        matchesPrice =
          price > 2000000 &&
          price <= 3000000;
      }

      if (priceRange === "above30") {
        matchesPrice = price > 3000000;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      const priceA = Number(a.price || 0);
      const priceB = Number(b.price || 0);

      if (sortBy === "low") {
        return priceA - priceB;
      }

      if (sortBy === "high") {
        return priceB - priceA;
      }

      if (sortBy === "name") {
        return `${a.make} ${a.model}`.localeCompare(
          `${b.make} ${b.model}`
        );
      }

      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    });

  // ==============================
  // CLEAR FILTERS
  // ==============================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setPriceRange("All");
    setSortBy("newest");
  };

  const hasFilters =
    search ||
    category !== "All" ||
    priceRange !== "All" ||
    sortBy !== "newest";

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
            <span>Available Vehicles</span>
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

            <h1>Find Your Vehicle</h1>

            <p>
              Search, filter and choose the vehicle
              that suits you.
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

          {/* SEARCH */}

          <div className="user-vehicles-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search make, model or category..."
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

          {/* CATEGORY */}

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

          {/* PRICE */}

          <select
            value={priceRange}
            onChange={(e) =>
              setPriceRange(e.target.value)
            }
          >
            <option value="All">
              All Prices
            </option>

            <option value="under10">
              Under ₹10 Lakhs
            </option>

            <option value="10to20">
              ₹10 - ₹20 Lakhs
            </option>

            <option value="20to30">
              ₹20 - ₹30 Lakhs
            </option>

            <option value="above30">
              Above ₹30 Lakhs
            </option>
          </select>

          {/* SORT */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="newest">
              Newest Vehicles
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

            <option value="name">
              Name: A to Z
            </option>
          </select>

          {/* CLEAR */}

          {hasFilters && (
            <button
              className="user-clear-filters"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}

        </section>

        {/* ERROR */}

        {error && (
          <div className="user-vehicles-error">

            <span>⚠️ {error}</span>

            <button onClick={fetchVehicles}>
              Try Again
            </button>

          </div>
        )}

        {/* RESULT HEADER */}

        {!error && (
          <div className="user-vehicles-result-header">

            <div>
              <strong>
                {filteredVehicles.length}
              </strong>{" "}
              vehicle
              {filteredVehicles.length !== 1
                ? "s"
                : ""}{" "}
              found
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
              >
                Reset Filters
              </button>
            )}

          </div>
        )}

        {/* VEHICLES */}

        {filteredVehicles.length === 0 ? (

          <div className="user-no-vehicles">

            <div>🚗</div>

            <h2>No vehicles found</h2>

            <p>
              Try changing your search or
              filter options.
            </p>

            <button
              onClick={clearFilters}
            >
              Show All Vehicles
            </button>

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

                  {/* TOP */}

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

                  {/* INFO */}

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

                  {/* DETAILS */}

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

                  {/* PURCHASE */}

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
