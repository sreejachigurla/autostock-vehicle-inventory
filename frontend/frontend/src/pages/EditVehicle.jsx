import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./EditVehicle.css";

function EditVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    category: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVehicle();
  }, [id]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get(`/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const vehicle =
        response.data.vehicle || response.data;

      setFormData({
        make: vehicle.make || "",
        model: vehicle.model || "",
        category: vehicle.category || "",
        price: vehicle.price || "",
        quantity: vehicle.quantity || "",
      });
    } catch (error) {
      console.error("Load vehicle error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load vehicle"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      await api.put(
        `/vehicles/${id}`,
        {
          make: formData.make,
          model: formData.model,
          category: formData.category,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vehicle updated successfully!");

      navigate("/vehicles");
    } catch (error) {
      console.error("Update vehicle error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update vehicle"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <div className="edit-loading">
          <div className="edit-loading-icon">
            🚘
          </div>

          <h2>Loading Vehicle...</h2>

          <p>
            Please wait while we load the vehicle details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-page">

      <div className="edit-container">

        {/* BACK */}

        <button
          className="edit-back-button"
          onClick={() => navigate("/vehicles")}
        >
          ← Back to Vehicle Inventory
        </button>


        {/* HEADER */}

        <div className="edit-header">

          <div className="edit-header-icon">
            ✏️
          </div>

          <div>

            <p className="edit-eyebrow">
              INVENTORY MANAGEMENT
            </p>

            <h1>
              Edit Vehicle
            </h1>

            <p>
              Update vehicle information and inventory
              details.
            </p>

          </div>

        </div>


        {/* CARD */}

        <div className="edit-card">

          <div className="edit-card-header">

            <div>
              <h2>
                Vehicle Information
              </h2>

              <p>
                Modify the details below and save your
                changes.
              </p>
            </div>

            <span className="edit-id">
              ID: {id?.slice(-6)}
            </span>

          </div>


          {/* ERROR */}

          {error && (
            <div className="edit-error">
              ⚠️ {error}
            </div>
          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <div className="edit-form-grid">

              {/* MAKE */}

              <div className="edit-field">

                <label>
                  Make <span>*</span>
                </label>

                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="Example: Toyota"
                  required
                />

              </div>


              {/* MODEL */}

              <div className="edit-field">

                <label>
                  Model <span>*</span>
                </label>

                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Example: Camry"
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="edit-field">

                <label>
                  Category <span>*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Sedan">
                    Sedan
                  </option>

                  <option value="SUV">
                    SUV
                  </option>

                  <option value="Hatchback">
                    Hatchback
                  </option>

                  <option value="MUV">
                    MUV
                  </option>

                  <option value="Coupe">
                    Coupe
                  </option>

                  <option value="Convertible">
                    Convertible
                  </option>

                  <option value="Pickup">
                    Pickup
                  </option>

                </select>

              </div>


              {/* PRICE */}

              <div className="edit-field">

                <label>
                  Price <span>*</span>
                </label>

                <div className="edit-price-input">

                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />

                </div>

              </div>


              {/* QUANTITY */}

              <div className="edit-field">

                <label>
                  Available Stock <span>*</span>
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />

                <small>
                  Enter the current available units.
                </small>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="edit-form-actions">

              <button
                type="button"
                className="edit-cancel-button"
                onClick={() => navigate("/vehicles")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-button"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "✓ Update Vehicle"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditVehicle;