const User = require("../models/User");

// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            message: "Failed to load users",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE USER
// ==========================================

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name) {
            user.name = name.trim();
        }

        if (email) {
            user.email = email.toLowerCase().trim();
        }

        if (role) {
            if (!["user", "admin"].includes(role)) {
                return res.status(400).json({
                    message: "Invalid role"
                });
            }

            user.role = role;
        }

        if (password) {
            user.password = password;
        }

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error("Update user error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update user",
            error: error.message
        });
    }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user && req.user.id === id) {
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};


module.exports = {
    getUsers,
    updateUser,
    deleteUser
};