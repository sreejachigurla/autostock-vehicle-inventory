const express = require("express");

const {
    getUsers
} = require("../controllers/UserController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);

module.exports = router;