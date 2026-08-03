const express = require("express");

const router = express.Router();

const {
    createEvent,
    getEvents,
    getEventById,
    deleteEvent,
    updateEvent
} = require("../controllers/eventController");
// Get all events
router.get("/", getEvents);

// Create new event
router.post("/", createEvent);
// Get event by ID
router.get("/:id", getEventById);
// Delete event
router.delete("/:id", deleteEvent);

// Update event
router.put("/:id", updateEvent);

module.exports = router;