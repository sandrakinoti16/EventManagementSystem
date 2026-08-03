const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");


// Register
router.post("/register", authController.registerUser);


// Login
router.post("/login", authController.loginUser);


// Logout
router.post("/logout", authController.logoutUser);


// Get Current User
router.get("/current-user", authController.getCurrentUser);


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