const Vehicle = require("../models/Vehicle");
const Purchase = require("../models/Purchase");


// ==========================================
// GET VEHICLE IMAGE
// ==========================================

const getVehicleImage = (category) => {

    const type = String(category || "").toLowerCase();

    if (type.includes("suv")) {
        return "https://loremflickr.com/800/500/suv,car";
    }

    if (type.includes("sedan")) {
        return "https://loremflickr.com/800/500/sedan,car";
    }

    if (
        type.includes("hatchback") ||
        type.includes("hatch")
    ) {
        return "https://loremflickr.com/800/500/hatchback,car";
    }

    if (
        type.includes("electric") ||
        type.includes("ev")
    ) {
        return "https://loremflickr.com/800/500/electric,car";
    }

    if (
        type.includes("truck") ||
        type.includes("pickup")
    ) {
        return "https://loremflickr.com/800/500/truck,vehicle";
    }

    if (
        type.includes("luxury") ||
        type.includes("premium")
    ) {
        return "https://loremflickr.com/800/500/luxury,car";
    }

    return "https://loremflickr.com/800/500/car,automobile";
};


// ==========================================
// ADD VEHICLE - ADMIN
// ==========================================

const addVehicle = async (req, res) => {
    try {

        const {
            make,
            model,
            category,
            price,
            quantity
        } = req.body;

        if (
            !make ||
            !model ||
            !category ||
            price === undefined ||
            quantity === undefined
        ) {
            return res.status(400).json({
                message: "All vehicle fields are required"
            });
        }

        if (
            Number(price) < 0 ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "Price and quantity cannot be negative"
            });
        }

        const cleanMake = make.trim();
        const cleanModel = model.trim();
        const cleanCategory = category.trim();

        const vehicle = await Vehicle.create({
            make: cleanMake,
            model: cleanModel,
            category: cleanCategory,
            price: Number(price),
            quantity: Number(quantity),

            // Automatically select image
            image: getVehicleImage(cleanCategory)
        });

        res.status(201).json({
            message: "Vehicle added successfully",
            vehicle
        });

    } catch (error) {

        console.error(
            "Add vehicle error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL VEHICLES
// ==========================================

const getVehicles = async (req, res) => {
    try {

        const vehicles = await Vehicle.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: vehicles.length,
            vehicles
        });

    } catch (error) {

        console.error(
            "Get vehicles error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// SEARCH VEHICLES
// ==========================================

const searchVehicles = async (req, res) => {
    try {

        const {
            make,
            model,
            category,
            minPrice,
            maxPrice
        } = req.query;

        const filter = {};

        if (make) {
            filter.make = {
                $regex: make,
                $options: "i"
            };
        }

        if (model) {
            filter.model = {
                $regex: model,
                $options: "i"
            };
        }

        if (category) {
            filter.category = {
                $regex: category,
                $options: "i"
            };
        }

        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const vehicles = await Vehicle.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: vehicles.length,
            vehicles
        });

    } catch (error) {

        console.error(
            "Search vehicles error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET ONE VEHICLE
// ==========================================

const getVehicleById = async (req, res) => {
    try {

        const vehicle = await Vehicle.findById(
            req.params.id
        );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            vehicle
        });

    } catch (error) {

        console.error(
            "Get vehicle error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE VEHICLE - ADMIN
// ==========================================

const updateVehicle = async (req, res) => {
    try {

        const {
            make,
            model,
            category,
            price,
            quantity
        } = req.body;

        if (
            price !== undefined &&
            Number(price) < 0
        ) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }

        if (
            quantity !== undefined &&
            Number(quantity) < 0
        ) {
            return res.status(400).json({
                message: "Quantity cannot be negative"
            });
        }

        const updateData = {};

        if (make !== undefined) {
            updateData.make = make.trim();
        }

        if (model !== undefined) {
            updateData.model = model.trim();
        }

        if (category !== undefined) {

            const cleanCategory = category.trim();

            updateData.category = cleanCategory;

            // Update image when category changes
            updateData.image =
                getVehicleImage(cleanCategory);
        }

        if (price !== undefined) {
            updateData.price = Number(price);
        }

        if (quantity !== undefined) {
            updateData.quantity = Number(quantity);
        }

        const vehicle =
            await Vehicle.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle
        });

    } catch (error) {

        console.error(
            "Update vehicle error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// DELETE VEHICLE - ADMIN
// ==========================================

const deleteVehicle = async (req, res) => {
    try {

        const vehicle =
            await Vehicle.findByIdAndDelete(
                req.params.id
            );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete vehicle error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// PURCHASE VEHICLE - USER + ADMIN
// ==========================================

const purchaseVehicle = async (req, res) => {
    try {

        const vehicle =
            await Vehicle.findById(
                req.params.id
            );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        if (vehicle.quantity <= 0) {
            return res.status(400).json({
                message: "Vehicle is out of stock"
            });
        }

        // Decrease stock
        vehicle.quantity -= 1;

        await vehicle.save();

        // Create purchase
        const purchase =
            await Purchase.create({
                user: req.user.id,
                vehicle: vehicle._id,
                quantity: 1,
                purchasePrice: vehicle.price
            });

        res.status(200).json({
            message:
                "Vehicle purchased successfully",
            vehicle,
            purchase
        });

    } catch (error) {

        console.error(
            "Purchase vehicle error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET MY PURCHASED VEHICLES
// ==========================================

const getMyVehicles = async (req, res) => {
    try {

        const purchases =
            await Purchase.find({
                user: req.user.id
            })
                .populate("vehicle")
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            count: purchases.length,
            purchases
        });

    } catch (error) {

        console.error(
            "Get my vehicles error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load your vehicles",
            error: error.message
        });
    }
};


// ==========================================
// RESTOCK VEHICLE - ADMIN
// ==========================================

const restockVehicle = async (req, res) => {
    try {

        const { quantity } = req.body;

        if (
            quantity === undefined ||
            Number(quantity) <= 0
        ) {
            return res.status(400).json({
                message:
                    "Restock quantity must be greater than 0"
            });
        }

        const vehicle =
            await Vehicle.findById(
                req.params.id
            );

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        vehicle.quantity += Number(quantity);

        await vehicle.save();

        res.status(200).json({
            message:
                "Vehicle restocked successfully",
            vehicle
        });

    } catch (error) {

        console.error(
            "Restock vehicle error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    addVehicle,
    getVehicles,
    searchVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    getMyVehicles,
    restockVehicle
};