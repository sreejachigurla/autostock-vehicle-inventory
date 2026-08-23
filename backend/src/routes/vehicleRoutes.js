const express = require("express");
const router = express.Router();

const {
    addVehicle,
    getVehicles,
    searchVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    getMyVehicles,
    restockVehicle
} = require("../controllers/vehicleController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


// ==========================================
// SEARCH VEHICLES
// GET /api/vehicles/search
// ==========================================

router.get("/search", protect, searchVehicles);


// ==========================================
// MY PURCHASED VEHICLES
// GET /api/vehicles/my
// IMPORTANT: Keep this BEFORE /:id
// ==========================================

router.get("/my", protect, getMyVehicles);


// ==========================================
// ADD VEHICLE - ADMIN ONLY
// POST /api/vehicles
// ==========================================

router.post(
    "/",
    protect,
    adminOnly,
    addVehicle
);


// ==========================================
// GET ALL VEHICLES
// GET /api/vehicles
// USER + ADMIN
// ==========================================

router.get(
    "/",
    protect,
    getVehicles
);


// ==========================================
// GET ONE VEHICLE
// GET /api/vehicles/:id
// USER + ADMIN
// ==========================================

router.get(
    "/:id",
    protect,
    getVehicleById
);


// ==========================================
// UPDATE VEHICLE - ADMIN ONLY
// PUT /api/vehicles/:id
// ==========================================

router.put(
    "/:id",
    protect,
    adminOnly,
    updateVehicle
);


// ==========================================
// DELETE VEHICLE - ADMIN ONLY
// DELETE /api/vehicles/:id
// ==========================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteVehicle
);


// ==========================================
// PURCHASE VEHICLE
// POST /api/vehicles/:id/purchase
// USER + ADMIN
// ==========================================

router.post(
    "/:id/purchase",
    protect,
    purchaseVehicle
);


// ==========================================
// RESTOCK VEHICLE - ADMIN ONLY
// POST /api/vehicles/:id/restock
// ==========================================

router.post(
    "/:id/restock",
    protect,
    adminOnly,
    restockVehicle
);


module.exports = router;