import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Vehicles.css";

function MyVehicles() {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyVehicles = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/vehicles/my", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setVehicles(response.data.purchases || []);

        } catch (error) {
            console.error(
                "My vehicles error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your vehicles"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyVehicles();
    }, []);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="vehicles-loading">
                <div className="vehicle-spinner"></div>

                <h2>Loading Your Vehicles...</h2>

                <p>
                    Please wait while we load your purchased vehicles.
                </p>
            </div>
        );
    }

    return (
        <div className="vehicles-page">

            {/* ==========================================
                HEADER
            ========================================== */}

            <header className="vehicles-header">

                <div className="vehicles-brand">

                    <div className="vehicles-logo">
                        🚗
                    </div>

                    <div>
                        <h2>Vehicle Management</h2>
                        <span>My Vehicles</span>
                    </div>

                </div>

                <button
                    className="back-dashboard-button"
                    onClick={() => navigate("/user-dashboard")}
                >
                    ← Dashboard
                </button>

            </header>


            {/* ==========================================
                MAIN
            ========================================== */}

            <main className="vehicles-main">

                {/* INTRO */}

                <section className="vehicles-intro">

                    <div>

                        <p className="vehicles-eyebrow">
                            MY VEHICLES
                        </p>

                        <h1>My Purchased Vehicles</h1>

                        <p>
                            View the vehicles you have purchased.
                        </p>

                    </div>

                    <button
                        className="refresh-vehicles"
                        onClick={fetchMyVehicles}
                    >
                        🔄 Refresh
                    </button>

                </section>


                {/* ==========================================
                    ERROR
                ========================================== */}

                {error && (
                    <div className="vehicles-error">

                        ⚠️ {error}

                        <button
                            onClick={fetchMyVehicles}
                        >
                            Try Again
                        </button>

                    </div>
                )}


                {/* ==========================================
                    NO PURCHASES
                ========================================== */}

                {!error && vehicles.length === 0 ? (

                    <div className="no-vehicles">

                        <div>🚗</div>

                        <h2>No purchased vehicles</h2>

                        <p>
                            You have not purchased any vehicles yet.
                        </p>

                        <button
                            className="purchase-button"
                            onClick={() => navigate("/vehicles")}
                        >
                            Browse Available Vehicles
                        </button>

                    </div>

                ) : (

                    /* ==========================================
                       PURCHASED VEHICLES
                    ========================================== */

                    <section className="vehicle-grid">

                        {vehicles.map((purchase) => {

                            // Vehicle details are inside purchase.vehicle
                            const vehicle = purchase.vehicle;

                            // If vehicle was deleted from inventory,
                            // vehicle can be null.
                            if (!vehicle) {
                                return (
                                    <div
                                        className="vehicle-card"
                                        key={purchase._id}
                                    >

                                        <div className="vehicle-card-top">

                                            <div className="vehicle-icon">
                                                🚗
                                            </div>

                                            <span className="stock-badge">
                                                Purchased
                                            </span>

                                        </div>

                                        <div className="vehicle-info">

                                            <span className="vehicle-category">
                                                Vehicle
                                            </span>

                                            <h2>
                                                Vehicle no longer available
                                            </h2>

                                            <div className="vehicle-price">
                                                ₹
                                                {Number(
                                                    purchase.purchasePrice || 0
                                                ).toLocaleString("en-IN")}
                                            </div>

                                        </div>

                                        <div className="vehicle-details">

                                            <div>
                                                <span>Make</span>

                                                <strong>
                                                    —
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Model</span>

                                                <strong>
                                                    —
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Category</span>

                                                <strong>
                                                    —
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Status</span>

                                                <strong>
                                                    Purchased
                                                </strong>
                                            </div>

                                        </div>

                                    </div>
                                );
                            }

                            return (
                                <div
                                    className="vehicle-card"
                                    key={purchase._id}
                                >

                                    {/* TOP */}

                                    <div className="vehicle-card-top">

                                        <div className="vehicle-icon">
                                            🚗
                                        </div>

                                        <span className="stock-badge">
                                            Purchased
                                        </span>

                                    </div>


                                    {/* VEHICLE INFORMATION */}

                                    <div className="vehicle-info">

                                        <span className="vehicle-category">
                                            {vehicle.category || "Vehicle"}
                                        </span>

                                        <h2>
                                            {vehicle.make}{" "}
                                            {vehicle.model}
                                        </h2>

                                        <div className="vehicle-price">

                                            ₹
                                            {Number(
                                                purchase.purchasePrice ||
                                                vehicle.price ||
                                                0
                                            ).toLocaleString("en-IN")}

                                        </div>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="vehicle-details">

                                        <div>

                                            <span>
                                                Make
                                            </span>

                                            <strong>
                                                {vehicle.make || "—"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Model
                                            </span>

                                            <strong>
                                                {vehicle.model || "—"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Category
                                            </span>

                                            <strong>
                                                {vehicle.category || "—"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Status
                                            </span>

                                            <strong>
                                                Purchased
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

export default MyVehicles;