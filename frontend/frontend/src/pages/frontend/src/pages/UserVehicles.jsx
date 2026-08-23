import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Vehicles.css";

function Vehicles() {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

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
                    Authorization: `Bearer ${token}`
                }
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
    // SEARCH
    // ==========================================

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!search.trim()) {
                await fetchVehicles();
                return;
            }

            const response = await api.get(
                `/vehicles/search?make=${encodeURIComponent(search)}&model=${encodeURIComponent(search)}&category=${encodeURIComponent(search)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVehicles(response.data.vehicles || []);

        } catch (error) {
            console.error(
                "Search error:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to search vehicles"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // PURCHASE
    // ==========================================

    const handlePurchase = async (vehicleId) => {
        const confirmPurchase = window.confirm(
            "Are you sure you want to purchase this vehicle?"
        );

        if (!confirmPurchase) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                `/vehicles/${vehicleId}/purchase`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="vehicles-page">
                <div className="vehicles-loading">
                    <div className="vehicles-loading-icon">
                        🚗
                    </div>

                    <h2>Loading Vehicles...</h2>

                    <p>
                        Please wait while we load the vehicles.
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="vehicles-page">

            <div className="vehicles-container">

                {/* HEADER */}

                <header className="vehicles-header">

                    <div>

                        <button
                            className="back-button"
                            onClick={() =>
                                navigate("/user-dashboard")
                            }
                        >
                            ← Back to Dashboard
                        </button>

                        <p className="vehicles-eyebrow">
                            VEHICLE INVENTORY
                        </p>

                        <h1>My Vehicles</h1>

                        <p className="vehicles-subtitle">
                            Browse available vehicles and purchase
                            the one you like.
                        </p>

                    </div>

                    <button
                        className="refresh-button"
                        onClick={fetchVehicles}
                    >
                        🔄 Refresh
                    </button>

                </header>

                {/* SEARCH */}

                <section className="vehicle-search-section">

                    <input
                        type="text"
                        placeholder="Search by make, model or category..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />

                    <button onClick={handleSearch}>
                        🔍 Search
                    </button>

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => {
                                setSearch("");
                                fetchVehicles();
                            }}
                        >
                            Clear
                        </button>
                    )}

                </section>

                {/* ERROR */}

                {error && (
                    <div className="vehicles-error">
                        ⚠️ {error}

                        <button onClick={fetchVehicles}>
                            Try Again
                        </button>
                    </div>
                )}

                {/* VEHICLES */}

                {vehicles.length === 0 ? (

                    <div className="no-vehicles">

                        <div>
                            🚗
                        </div>

                        <h2>
                            No vehicles found
                        </h2>

                        <p>
                            There are currently no vehicles
                            available.
                        </p>

                    </div>

                ) : (

                    <div className="vehicle-grid">

                        {vehicles.map((vehicle) => (

                            <div
                                className="vehicle-card"
                                key={vehicle._id}
                            >

                                <div className="vehicle-card-icon">
                                    🚗
                                </div>

                                <div className="vehicle-card-content">

                                    <span className="vehicle-category">
                                        {vehicle.category || "Vehicle"}
                                    </span>

                                    <h2>
                                        {vehicle.make}{" "}
                                        {vehicle.model}
                                    </h2>

                                    <div className="vehicle-details">

                                        <div>
                                            <span>
                                                Price
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    vehicle.price || 0
                                                ).toLocaleString("en-IN")}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                In Stock
                                            </span>

                                            <strong>
                                                {vehicle.quantity ?? 0}
                                            </strong>
                                        </div>

                                    </div>

                                    <button
                                        className="purchase-button"
                                        disabled={
                                            !vehicle.quantity ||
                                            vehicle.quantity <= 0
                                        }
                                        onClick={() =>
                                            handlePurchase(
                                                vehicle._id
                                            )
                                        }
                                    >
                                        {!vehicle.quantity ||
                                        vehicle.quantity <= 0
                                            ? "Out of Stock"
                                            : "🛒 Purchase"}
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Vehicles;