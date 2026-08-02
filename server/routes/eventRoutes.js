const express = require("express");

const router = express.Router();

const {
    createEvent,
    getEvents,
    deleteEvent,
    updateEvent
} = require("../controllers/eventController");
// Get all events
router.get("/", getEvents);

// Create new event
router.post("/", createEvent);

// Delete event
router.delete("/:id", deleteEvent);

// Update event
router.put("/:id", updateEvent);

module.exports = router;