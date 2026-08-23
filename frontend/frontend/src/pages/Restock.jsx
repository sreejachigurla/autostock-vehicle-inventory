import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Restock.css";

function Restock() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const token = localStorage.getItem("token");

  // =====================================
  // FETCH VEHICLES
  // =====================================

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data.vehicles || []);

    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to load inventory."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // =====================================
  // RESTOCK
  // =====================================

  const handleRestock = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!selectedVehicle) {
      setMessage(
        "Please select a vehicle."
      );

      setMessageType("error");

      return;
    }

    if (!quantity) {
      setMessage(
        "Please enter a quantity."
      );

      setMessageType("error");

      return;
    }

    if (Number(quantity) <= 0) {
      setMessage(
        "Quantity must be greater than 0."
      );

      setMessageType("error");

      return;
    }

    try {

      setSubmitting(true);

      const response = await api.post(
        `/vehicles/${selectedVehicle}/restock`,
        {
          quantity: Number(quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Vehicle restocked successfully!"
      );

      setMessageType("success");

      setQuantity("");

      await fetchVehicles();

    } catch (error) {

      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to restock vehicle."
      );

      setMessageType("error");

    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // SELECTED VEHICLE
  // =====================================

  const selected = vehicles.find(
    (vehicle) =>
      vehicle._id === selectedVehicle
  );

  return (
    <div className="restock-page">

      {/* =================================
          HEADER
      ================================= */}

      <header className="restock-topbar">

        <button
          className="restock-back"
          onClick={() =>
            navigate("/admin-dashboard")
          }
        >
          ← Dashboard
        </button>

        <div className="restock-brand">
          🚗 AutoStock
        </div>

      </header>


      {/* =================================
          MAIN
      ================================= */}

      <main className="restock-container">

        <div className="restock-heading">

          <div className="restock-heading-icon">
            📦
          </div>

          <div>

            <p>
              INVENTORY MANAGEMENT
            </p>

            <h1>
              Restock Vehicles
            </h1>

            <span>
              Increase available stock
              for your dealership.
            </span>

          </div>

        </div>


        {/* =================================
            FORM CARD
        ================================= */}

        <section className="restock-main-card">

          <div className="restock-card-header">

            <div>

              <h2>
                Update Vehicle Stock
              </h2>

              <p>
                Select a vehicle and enter
                the number of units to add.
              </p>

            </div>

            <div className="stock-header-icon">
              📦
            </div>

          </div>


          <form
            onSubmit={handleRestock}
            className="restock-form"
          >

            {/* Vehicle */}

            <div className="restock-field">

              <label>
                Select Vehicle
              </label>

              <select
                value={selectedVehicle}
                onChange={(e) =>
                  setSelectedVehicle(
                    e.target.value
                  )
                }
                disabled={loading}
              >

                <option value="">

                  {loading
                    ? "Loading vehicles..."
                    : "Choose a vehicle"}

                </option>

                {vehicles.map(
                  (vehicle) => (

                    <option
                      key={vehicle._id}
                      value={vehicle._id}
                    >

                      {vehicle.make}{" "}
                      {vehicle.model}{" "}
                      — Stock:{" "}
                      {vehicle.quantity}

                    </option>

                  )
                )}

              </select>

            </div>


            {/* Selected Vehicle Preview */}

            {selected && (

              <div className="selected-vehicle">

                <div className="selected-car-icon">
                  🚘
                </div>

                <div>

                  <strong>
                    {selected.make}{" "}
                    {selected.model}
                  </strong>

                  <span>
                    {selected.category}
                  </span>

                </div>

                <div className="current-stock">

                  <small>
                    Current Stock
                  </small>

                  <strong>
                    {selected.quantity}
                  </strong>

                </div>

              </div>

            )}


            {/* Quantity */}

            <div className="restock-field">

              <label>
                Quantity to Add
              </label>

              <input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
              />

              <small>
                Enter the number of new
                units received.
              </small>

            </div>


            {/* New Stock Preview */}

            {selected &&
              quantity &&
              Number(quantity) > 0 && (

                <div className="stock-preview">

                  <div>
                    <span>
                      Current Stock
                    </span>

                    <strong>
                      {selected.quantity}
                    </strong>
                  </div>

                  <div className="plus">
                    +
                  </div>

                  <div>
                    <span>
                      Adding
                    </span>

                    <strong>
                      {Number(quantity)}
                    </strong>
                  </div>

                  <div className="equals">
                    =
                  </div>

                  <div className="new-stock">

                    <span>
                      New Stock
                    </span>

                    <strong>
                      {Number(
                        selected.quantity
                      ) +
                        Number(quantity)}
                    </strong>

                  </div>

                </div>

              )}


            {/* Message */}

            {message && (

              <div
                className={`restock-message ${messageType}`}
              >
                {message}
              </div>

            )}


            {/* Buttons */}

            <div className="restock-actions">

              <button
                type="button"
                className="restock-cancel"
                onClick={() =>
                  navigate(
                    "/admin-dashboard"
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="restock-submit"
                disabled={
                  submitting ||
                  loading
                }
              >

                {submitting
                  ? "Updating..."
                  : "📦 Restock Vehicle"}

              </button>

            </div>

          </form>

        </section>


        {/* =================================
            INVENTORY
        ================================= */}

        <section className="inventory-card">

          <div className="inventory-header">

            <div>

              <h2>
                Current Inventory
              </h2>

              <p>
                Select a vehicle above
                to update its stock.
              </p>

            </div>

            <span>
              {vehicles.length} Models
            </span>

          </div>


          <div className="inventory-grid">

            {vehicles.map(
              (vehicle) => (

                <div
                  className="inventory-item"
                  key={vehicle._id}
                  onClick={() =>
                    setSelectedVehicle(
                      vehicle._id
                    )
                  }
                >

                  <div className="inventory-car">
                    🚘
                  </div>

                  <div className="inventory-details">

                    <strong>
                      {vehicle.make}{" "}
                      {vehicle.model}
                    </strong>

                    <span>
                      {vehicle.category}
                    </span>

                  </div>

                  <div className="inventory-stock">

                    <small>
                      STOCK
                    </small>

                    <strong>
                      {vehicle.quantity}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Restock;