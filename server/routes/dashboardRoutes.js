console.log("dashboardRoutes.js loaded");
const express = require("express");

const router = express.Router();

const {
    getDashboardStats,
    getUpcomingEvents,
    getChartData,
    getRecentActivity,
    getReportsData
} = require("../controllers/dashboardController");
router.get("/test", (req, res) => {
    console.log("Dashboard test route hit");
    res.send("Dashboard routes are working!");
});

router.get("/", getDashboardStats);
router.get("/events", getUpcomingEvents);
router.get("/charts", getChartData);
router.get("/activity", getRecentActivity);
router.get("/reports/:type", getReportsData);

module.exports = router;