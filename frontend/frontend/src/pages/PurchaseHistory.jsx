import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Vehicles.css";

function PurchaseHistory() {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPurchaseHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/vehicles/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchases(response.data.purchases || []);
    } catch (error) {
      console.error(
        "Purchase history error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load purchase history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  if (loading) {
    return (
      <div className="vehicles-loading">
        <div className="vehicle-spinner"></div>

        <h2>Loading Purchase History...</h2>

        <p>
          Please wait while we load your purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="vehicles-page">

      {/* HEADER */}

      <header className="vehicles-header">

        <div className="vehicles-brand">

          <div className="vehicles-logo">
            🚗
          </div>

          <div>
            <h2>Vehicle Management</h2>
            <span>Purchase History</span>
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
              PURCHASE HISTORY
            </p>

            <h1>My Purchase History</h1>

            <p>
              View all vehicles you have purchased.
            </p>

          </div>

          <button
            className="refresh-vehicles"
            onClick={fetchPurchaseHistory}
          >
            🔄 Refresh
          </button>

        </section>


        {/* ERROR */}

        {error && (
          <div className="vehicles-error">

            ⚠️ {error}

            <button
              onClick={fetchPurchaseHistory}
            >
              Try Again
            </button>

          </div>
        )}


        {/* EMPTY */}

        {!error && purchases.length === 0 ? (

          <div className="no-vehicles">

            <div>🧾</div>

            <h2>No Purchase History</h2>

            <p>
              You have not purchased any vehicles yet.
            </p>

            <button
              className="purchase-button"
              onClick={() =>
                navigate("/vehicles")
              }
            >
              Browse Vehicles
            </button>

          </div>

        ) : (

          <section className="vehicle-grid">

            {purchases.map((purchase) => {

              const price = Number(
                purchase.purchasePrice ??
                purchase.price ??
                purchase.vehicle?.price ??
                0
              );

              const make =
                purchase.make ||
                purchase.vehicle?.make ||
                "—";

              const model =
                purchase.model ||
                purchase.vehicle?.model ||
                "—";

              const category =
                purchase.category ||
                purchase.vehicle?.category ||
                "Vehicle";

              const quantity =
                Number(purchase.quantity || 1);

              const purchaseDate =
                purchase.createdAt
                  ? new Date(
                      purchase.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "—";

              const total =
                price * quantity;

              return (

                <div
                  className="vehicle-card"
                  key={purchase._id}
                >

                  {/* TOP */}

                  <div className="vehicle-card-top">

                    <div className="vehicle-icon">
                      🧾
                    </div>

                    <span className="stock-badge">
                      Purchased
                    </span>

                  </div>


                  {/* VEHICLE INFO */}

                  <div className="vehicle-info">

                    <span className="vehicle-category">
                      {category}
                    </span>

                    <h2>
                      {make} {model}
                    </h2>

                    <div className="vehicle-price">
                      ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="vehicle-details">

                    <div>
                      <span>Make</span>

                      <strong>
                        {make}
                      </strong>
                    </div>

                    <div>
                      <span>Model</span>

                      <strong>
                        {model}
                      </strong>
                    </div>

                    <div>
                      <span>Quantity</span>

                      <strong>
                        {quantity}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>

                      <strong>
                        Purchased
                      </strong>
                    </div>

                  </div>


                  {/* PURCHASE INFORMATION */}

                  <div className="vehicle-details">

                    <div>
                      <span>Purchase Date</span>

                      <strong>
                        {purchaseDate}
                      </strong>
                    </div>

                    <div>
                      <span>Total Amount</span>

                      <strong>
                        ₹
                        {total.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                  </div>

                </div>

              );
            })}

          </section>

        )}

      </main>

    </div>
  );
}

export default PurchaseHistory;