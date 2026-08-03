const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const session = require("express-session");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the ENTIRE project folder
app.use(express.static(path.join(__dirname, "..")));

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
// Home Route
app.get("/", (req, res) => {
    res.redirect("/auth/login.html");
});
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/registrations", registrationRoutes);
console.log("Dashboard route mounted");
console.log("Report routes mounted");
console.log("Registration routes mounted");

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});