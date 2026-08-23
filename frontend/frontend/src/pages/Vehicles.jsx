import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Vehicles.css";

function Vehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  const [sortBy, setSortBy] = useState("default");

  const [purchasingId, setPurchasingId] = useState(null);

  // ==========================================
  // GET VEHICLES
  // ==========================================

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
        "Vehicles error:",
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


  // ==========================================
  // PURCHASE VEHICLE
  // ==========================================

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

      fetchVehicles();

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


  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        vehicles
          .map((vehicle) => vehicle.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];

  }, [vehicles]);


  // ==========================================
  // FILTER + SEARCH + SORT
  // ==========================================

  const filteredVehicles = useMemo(() => {

    let result = [...vehicles];

    // SEARCH
    const searchText = search
      .trim()
      .toLowerCase();

    if (searchText) {

      result = result.filter((vehicle) => {

        const make =
          String(vehicle.make || "").toLowerCase();

        const model =
          String(vehicle.model || "").toLowerCase();

        const category =
          String(vehicle.category || "").toLowerCase();

        return (
          make.includes(searchText) ||
          model.includes(searchText) ||
          category.includes(searchText)
        );

      });
    }


    // CATEGORY
    if (category !== "All") {

      result = result.filter(
        (vehicle) =>
          vehicle.category === category
      );

    }


    // PRICE
    if (priceRange !== "All") {

      result = result.filter((vehicle) => {

        const price = Number(
          vehicle.price || 0
        );

        if (priceRange === "under10") {
          return price < 1000000;
        }

        if (priceRange === "10to20") {
          return (
            price >= 1000000 &&
            price <= 2000000
          );
        }

        if (priceRange === "20to30") {
          return (
            price > 2000000 &&
            price <= 3000000
          );
        }

        if (priceRange === "above30") {
          return price > 3000000;
        }

        return true;
      });
    }


    // SORT
    if (sortBy === "low") {

      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );

    } else if (sortBy === "high") {

      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );

    } else if (sortBy === "newest") {

      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    }

    return result;

  }, [
    vehicles,
    search,
    category,
    priceRange,
    sortBy,
  ]);


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setPriceRange("All");
    setSortBy("default");
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="vehicles-loading">

        <div className="vehicle-spinner"></div>

        <h2>
          Loading Vehicles...
        </h2>

        <p>
          Please wait while we load
          the vehicles.
        </p>

      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="vehicles-page">

      {/* HEADER */}

      <header className="vehicles-header">

        <div className="vehicles-brand">

          <div className="vehicles-logo">
            🚗
          </div>

          <div>
            <h2>
              Vehicle Management
            </h2>

            <span>
              Available Vehicles
            </span>
          </div>

        </div>


        <button
          className="back-dashboard-button"
          onClick={() =>
            navigate("/user-dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>


      {/* MAIN */}

      <main className="vehicles-main">

        {/* INTRO */}

        <section className="vehicles-intro">

          <div>

            <p className="vehicles-eyebrow">
              VEHICLE INVENTORY
            </p>

            <h1>
              Find Your Vehicle
            </h1>

            <p>
              Search, filter and choose
              the vehicle that suits you.
            </p>

          </div>


          <button
            className="refresh-vehicles"
            onClick={fetchVehicles}
          >
            🔄 Refresh
          </button>

        </section>


        {/* ================= FILTER BAR ================= */}

        <section className="vehicle-filters">

          {/* SEARCH */}

          <div className="vehicle-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by make, model or category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
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

            <option value="default">
              Sort By
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

            <option value="newest">
              Newest Vehicles
            </option>

          </select>


          {/* CLEAR */}

          <button
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear
          </button>

        </section>


        {/* RESULT COUNT */}

        <div className="vehicle-result-count">

          <strong>
            {filteredVehicles.length}
          </strong>

          {" "}
          vehicle
          {filteredVehicles.length !== 1
            ? "s"
            : ""}{" "}
          found

        </div>


        {/* ERROR */}

        {error && (

          <div className="vehicles-error">

            ⚠️ {error}

            <button
              onClick={fetchVehicles}
            >
              Try Again
            </button>

          </div>

        )}


        {/* NO RESULTS */}

        {!error &&
        filteredVehicles.length === 0 ? (

          <div className="no-vehicles">

            <div>
              🔍
            </div>

            <h2>
              No vehicles found
            </h2>

            <p>
              Try changing your search
              or filters.
            </p>

            <button
              className="purchase-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>

        ) : (

          /* VEHICLE GRID */

          <section className="vehicle-grid">

            {filteredVehicles.map(
              (vehicle) => {

                const quantity =
                  Number(
                    vehicle.quantity || 0
                  );

                const outOfStock =
                  quantity <= 0;

                const isPurchasing =
                  purchasingId ===
                  vehicle._id;


                return (

                  <div
                    className="vehicle-card"
                    key={vehicle._id}
                  >

                    {/* IMAGE */}

                    <div className="vehicle-image-container">

                      {vehicle.image ? (

                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="vehicle-image"
                          onError={(e) => {
                            e.target.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <div className="vehicle-image-placeholder">
                          🚗
                        </div>

                      )}

                    </div>


                    {/* TOP */}

                    <div className="vehicle-card-top">

                      <div className="vehicle-icon">
                        🚗
                      </div>

                      <span
                        className={
                          outOfStock
                            ? "stock-badge out"
                            : "stock-badge"
                        }
                      >
                        {outOfStock
                          ? "Out of Stock"
                          : `${quantity} Available`}
                      </span>

                    </div>


                    {/* INFO */}

                    <div className="vehicle-info">

                      <span className="vehicle-category">
                        {vehicle.category ||
                          "Vehicle"}
                      </span>

                      <h2>
                        {vehicle.make}{" "}
                        {vehicle.model}
                      </h2>

                      <div className="vehicle-price">

                        ₹
                        {Number(
                          vehicle.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="vehicle-details">

                      <div>

                        <span>
                          Make
                        </span>

                        <strong>
                          {vehicle.make ||
                            "—"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Model
                        </span>

                        <strong>
                          {vehicle.model ||
                            "—"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Category
                        </span>

                        <strong>
                          {vehicle.category ||
                            "—"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Stock
                        </span>

                        <strong>
                          {quantity}
                        </strong>

                      </div>

                    </div>


                    {/* PURCHASE */}

                    <button
                      className="purchase-button"
                      disabled={
                        outOfStock ||
                        isPurchasing
                      }
                      onClick={() =>
                        handlePurchase(
                          vehicle._id
                        )
                      }
                    >

                      {isPurchasing
                        ? "Purchasing..."
                        : outOfStock
                        ? "Out of Stock"
                        : "🛒 Purchase Vehicle"}

                    </button>

                  </div>

                );
              }
            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default Vehicles;