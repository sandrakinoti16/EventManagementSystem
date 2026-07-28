const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const session = require("express-session");

const app = express();
app.use(cors({
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
    credentials: true
}));
app.use(session({
    secret: "eventflow_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../auth")));

// Routes
app.use("/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("EventFlow Server is Running!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});