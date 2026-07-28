const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser
} = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Get Logged-in User
router.get("/profile", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Not logged in"
        });
    }

    res.json(req.session.user);

});

module.exports = router;