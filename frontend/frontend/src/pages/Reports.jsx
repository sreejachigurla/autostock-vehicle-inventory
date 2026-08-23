import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Reports.css";

function Reports() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // ==========================================
  // FETCH VEHICLES
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
      console.error("Reports error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load inventory analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    const values = [
      ...new Set(
        vehicles
          .map((vehicle) => vehicle.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...values];
  }, [vehicles]);

  // ==========================================
  // FILTERED VEHICLES
  // ==========================================

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const name =
        `${vehicle.make || ""} ${vehicle.model || ""}`.toLowerCase();

      const searchMatch = name.includes(
        search.toLowerCase()
      );

      const categoryMatch =
        categoryFilter === "All" ||
        vehicle.category === categoryFilter;

      const quantity = Number(vehicle.quantity || 0);

      let stockMatch = true;

      if (stockFilter === "Available") {
        stockMatch = quantity > 2;
      }

      if (stockFilter === "Low Stock") {
        stockMatch =
          quantity > 0 && quantity <= 2;
      }

      if (stockFilter === "Out of Stock") {
        stockMatch = quantity === 0;
      }

      return (
        searchMatch &&
        categoryMatch &&
        stockMatch
      );
    });
  }, [
    vehicles,
    search,
    categoryFilter,
    stockFilter,
  ]);

  // ==========================================
  // REPORT CALCULATIONS
  // ==========================================

  const totalModels = filteredVehicles.length;

  const totalStock = filteredVehicles.reduce(
    (sum, vehicle) =>
      sum + Number(vehicle.quantity || 0),
    0
  );

  const inventoryValue = filteredVehicles.reduce(
    (sum, vehicle) =>
      sum +
      Number(vehicle.price || 0) *
        Number(vehicle.quantity || 0),
    0
  );

  const availableModels = filteredVehicles.filter(
    (vehicle) =>
      Number(vehicle.quantity || 0) > 2
  ).length;

  const lowStockModels = filteredVehicles.filter(
    (vehicle) => {
      const quantity = Number(
        vehicle.quantity || 0
      );

      return quantity > 0 && quantity <= 2;
    }
  ).length;

  const outOfStockModels = filteredVehicles.filter(
    (vehicle) =>
      Number(vehicle.quantity || 0) === 0
  ).length;

  // ==========================================
  // PERCENTAGE
  // ==========================================

  const percentage = (value, total) => {
    if (!total) return 0;

    return Math.round(
      (value / total) * 100
    );
  };

  const availablePercentage = percentage(
    availableModels,
    totalModels
  );

  const lowStockPercentage = percentage(
    lowStockModels,
    totalModels
  );

  const outOfStockPercentage = percentage(
    outOfStockModels,
    totalModels
  );

  // ==========================================
  // CATEGORY ANALYSIS
  // ==========================================

  const categoryData = useMemo(() => {
    const map = {};

    filteredVehicles.forEach((vehicle) => {
      const category =
        vehicle.category || "Other";

      if (!map[category]) {
        map[category] = {
          name: category,
          models: 0,
          stock: 0,
          value: 0,
        };
      }

      map[category].models += 1;

      map[category].stock += Number(
        vehicle.quantity || 0
      );

      map[category].value +=
        Number(vehicle.price || 0) *
        Number(vehicle.quantity || 0);
    });

    return Object.values(map).sort(
      (a, b) => b.value - a.value
    );
  }, [filteredVehicles]);

  // ==========================================
  // TOP INVENTORY
  // ==========================================

  const topVehicles = useMemo(() => {
    return [...filteredVehicles]
      .sort(
        (a, b) =>
          Number(b.price || 0) *
            Number(b.quantity || 0) -
          Number(a.price || 0) *
            Number(a.quantity || 0)
      )
      .slice(0, 5);
  }, [filteredVehicles]);

  // ==========================================
  // MAX CATEGORY VALUE
  // ==========================================

  const maxCategoryValue = Math.max(
    ...categoryData.map(
      (item) => item.value
    ),
    1
  );

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStockFilter("All");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-loading">
          <div className="reports-loading-icon">
            📊
          </div>

          <h2>
            Loading Analytics...
          </h2>

          <p>
            Preparing your inventory report.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="reports-page">

      <div className="reports-container">

        {/* ======================================
            HEADER
        ====================================== */}

        <header className="reports-header">

          <div>

            <button
              className="reports-back"
              onClick={() =>
                navigate("/admin-dashboard")
              }
            >
              ← Back to Dashboard
            </button>

            <p className="reports-eyebrow">
              INVENTORY ANALYTICS
            </p>

            <h1>
              Report Analysis
            </h1>

            <p className="reports-subtitle">
              Analyze your dealership inventory,
              stock levels and inventory value.
            </p>

          </div>

          <button
            className="reports-refresh"
            onClick={fetchVehicles}
          >
            🔄 Refresh
          </button>

        </header>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="reports-error">
            ⚠️ {error}

            <button
              onClick={fetchVehicles}
            >
              Try Again
            </button>
          </div>
        )}


        {/* ======================================
            INTERACTIVE FILTER BAR
        ====================================== */}

        <section className="reports-filters">

          <div className="report-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search vehicle..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}

          </div>


          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
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


          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Stock
            </option>

            <option value="Available">
              Available
            </option>

            <option value="Low Stock">
              Low Stock
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>


          {(search ||
            categoryFilter !== "All" ||
            stockFilter !== "All") && (
            <button
              className="clear-filters"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          )}

        </section>


        {/* ======================================
            KPI CARDS
        ====================================== */}

        <section className="report-kpi-grid">

          <div className="report-kpi blue-card">

            <div className="kpi-icon">
              🚘
            </div>

            <div>
              <span>Total Models</span>

              <strong>
                {totalModels}
              </strong>

              <small>
                Vehicle models
              </small>
            </div>

          </div>


          <div className="report-kpi green-card">

            <div className="kpi-icon">
              📦
            </div>

            <div>
              <span>Total Stock</span>

              <strong>
                {totalStock}
              </strong>

              <small>
                Units available
              </small>
            </div>

          </div>


          <div className="report-kpi purple-card">

            <div className="kpi-icon">
              💰
            </div>

            <div>
              <span>Inventory Value</span>

              <strong>
                {formatMoney(
                  inventoryValue
                )}
              </strong>

              <small>
                Total stock worth
              </small>
            </div>

          </div>


          <div className="report-kpi orange-card">

            <div className="kpi-icon">
              ⚠️
            </div>

            <div>
              <span>Low Stock</span>

              <strong>
                {lowStockModels}
              </strong>

              <small>
                Need attention
              </small>
            </div>

          </div>

        </section>


        {/* ======================================
            ANALYTICS GRID
        ====================================== */}

        <section className="analytics-grid">


          {/* INVENTORY HEALTH */}

          <div className="analytics-card">

            <div className="analytics-card-header">

              <div>
                <h2>
                  Inventory Health
                </h2>

                <p>
                  Current stock condition
                  across your dealership.
                </p>
              </div>

              <div className="health-score">
                {availablePercentage}%
              </div>

            </div>


            <div className="health-list">

              {/* AVAILABLE */}

              <div className="health-item">

                <div className="health-title">

                  <span className="health-icon available-icon">
                    ✓
                  </span>

                  <div>
                    <strong>
                      Available
                    </strong>

                    <small>
                      {availableModels} models
                    </small>
                  </div>

                  <b>
                    {availablePercentage}%
                  </b>

                </div>

                <div className="progress-track">

                  <div
                    className="progress available-progress"
                    style={{
                      width: `${availablePercentage}%`,
                    }}
                  />

                </div>

              </div>


              {/* LOW STOCK */}

              <div className="health-item">

                <div className="health-title">

                  <span className="health-icon low-icon">
                    ⚠
                  </span>

                  <div>
                    <strong>
                      Low Stock
                    </strong>

                    <small>
                      {lowStockModels} models
                    </small>
                  </div>

                  <b>
                    {lowStockPercentage}%
                  </b>

                </div>

                <div className="progress-track">

                  <div
                    className="progress low-progress"
                    style={{
                      width: `${lowStockPercentage}%`,
                    }}
                  />

                </div>

              </div>


              {/* OUT OF STOCK */}

              <div className="health-item">

                <div className="health-title">

                  <span className="health-icon out-icon">
                    !
                  </span>

                  <div>
                    <strong>
                      Out of Stock
                    </strong>

                    <small>
                      {outOfStockModels} models
                    </small>
                  </div>

                  <b>
                    {outOfStockPercentage}%
                  </b>

                </div>

                <div className="progress-track">

                  <div
                    className="progress out-progress"
                    style={{
                      width: `${outOfStockPercentage}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* STOCK DISTRIBUTION */}

          <div className="analytics-card">

            <div className="analytics-card-header">

              <div>
                <h2>
                  Stock Distribution
                </h2>

                <p>
                  Inventory units by category.
                </p>
              </div>

            </div>


            <div className="distribution-chart">

              {categoryData.length === 0 ? (

                <div className="chart-empty">
                  No category data available.
                </div>

              ) : (

                categoryData.map(
                  (item, index) => {

                    const stockPercent =
                      percentage(
                        item.stock,
                        totalStock
                      );

                    return (
                      <div
                        className="distribution-item"
                        key={item.name}
                      >

                        <div className="distribution-top">

                          <div className="category-name">

                            <span className="category-dot">
                              {index + 1}
                            </span>

                            <strong>
                              {item.name}
                            </strong>

                          </div>

                          <strong>
                            {stockPercent}%
                          </strong>

                        </div>

                        <div className="distribution-track">

                          <div
                            className={`distribution-fill fill-${index % 4}`}
                            style={{
                              width: `${stockPercent}%`,
                            }}
                          />

                        </div>

                        <div className="distribution-meta">

                          <span>
                            {item.models}{" "}
                            {item.models === 1
                              ? "model"
                              : "models"}
                          </span>

                          <span>
                            {item.stock} units
                          </span>

                        </div>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </div>

        </section>


        {/* ======================================
            CATEGORY ANALYSIS
        ====================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div>
              <h2>
                Category Analysis
              </h2>

              <p>
                Detailed inventory performance
                by vehicle category.
              </p>
            </div>

          </div>


          <div className="category-grid">

            {categoryData.map((item) => {

              const valuePercentage =
                percentage(
                  item.value,
                  maxCategoryValue
                );

              const stockPercentage =
                percentage(
                  item.stock,
                  totalStock
                );

              return (
                <button
                  className={`category-report-card ${
                    categoryFilter === item.name
                      ? "selected-category"
                      : ""
                  }`}
                  key={item.name}
                  onClick={() =>
                    setCategoryFilter(
                      categoryFilter === item.name
                        ? "All"
                        : item.name
                    )
                  }
                >

                  <div className="category-card-top">

                    <div className="category-big-icon">
                      🚘
                    </div>

                    <div>

                      <h3>
                        {item.name}
                      </h3>

                      <span>
                        {item.models}{" "}
                        {item.models === 1
                          ? "model"
                          : "models"}
                      </span>

                    </div>

                    <span className="category-arrow">
                      →
                    </span>

                  </div>


                  <div className="category-stat-row">

                    <div>
                      <span>
                        Stock
                      </span>

                      <strong>
                        {item.stock}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Distribution
                      </span>

                      <strong>
                        {stockPercentage}%
                      </strong>
                    </div>

                    <div>
                      <span>
                        Value
                      </span>

                      <strong>
                        {formatMoney(
                          item.value
                        )}
                      </strong>
                    </div>

                  </div>


                  <div className="category-value-bar">

                    <div
                      style={{
                        width: `${Math.min(
                          valuePercentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </button>
              );
            })}

          </div>

        </section>


        {/* ======================================
            TOP INVENTORY
        ====================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div>
              <h2>
                Top Inventory Value
              </h2>

              <p>
                Vehicles contributing the most
                to your inventory value.
              </p>
            </div>

            <button
              className="view-inventory"
              onClick={() =>
                navigate("/vehicles")
              }
            >
              View Inventory →
            </button>

          </div>


          <div className="top-inventory-list">

            {topVehicles.length === 0 ? (

              <div className="chart-empty">
                No inventory data available.
              </div>

            ) : (

              topVehicles.map(
                (vehicle, index) => {

                  const value =
                    Number(
                      vehicle.price || 0
                    ) *
                    Number(
                      vehicle.quantity || 0
                    );

                  return (
                    <div
                      className="top-inventory-item"
                      key={vehicle._id}
                    >

                      <div className="rank">
                        #{index + 1}
                      </div>

                      <div className="top-vehicle-icon">
                        🚘
                      </div>

                      <div className="top-vehicle-info">

                        <strong>
                          {vehicle.make}{" "}
                          {vehicle.model}
                        </strong>

                        <span>
                          {vehicle.category ||
                            "Uncategorized"}
                        </span>

                      </div>

                      <div className="top-stock">

                        <span>
                          Stock
                        </span>

                        <strong>
                          {vehicle.quantity || 0}
                        </strong>

                      </div>

                      <div className="top-value">

                        <span>
                          Value
                        </span>

                        <strong>
                          {formatMoney(value)}
                        </strong>

                      </div>

                    </div>
                  );
                }
              )

            )}

          </div>

        </section>


        {/* ======================================
            INSIGHTS
        ====================================== */}

        <section className="insights-card">

          <div className="insights-icon">
            💡
          </div>

          <div className="insights-content">

            <p className="insights-label">
              INVENTORY INSIGHT
            </p>

            <h2>
              {outOfStockModels > 0
                ? "Some vehicles are currently out of stock."
                : lowStockModels > 0
                ? "Some vehicles need restocking attention."
                : "Your inventory is currently healthy."}
            </h2>

            <p>

              {outOfStockModels > 0
                ? `${outOfStockModels} vehicle model${
                    outOfStockModels > 1
                      ? "s are"
                      : " is"
                  } completely out of stock. Consider restocking to avoid missed sales opportunities.`
                : lowStockModels > 0
                ? `${lowStockModels} vehicle model${
                    lowStockModels > 1
                      ? "s have"
                      : " has"
                  } low stock levels. Consider reviewing these vehicles.`
                : "There are no low-stock or out-of-stock vehicles in the current inventory."}

            </p>

          </div>

          <button
            onClick={() =>
              navigate("/vehicles")
            }
          >
            Manage Inventory →
          </button>

        </section>


        {/* ======================================
            FOOTER
        ====================================== */}

        <div className="reports-footer">

          <span>
            📊 AutoStock Inventory Analytics
          </span>

          <span>
            Data based on current inventory
          </span>

        </div>

      </div>

    </div>
  );
}

export default Reports;