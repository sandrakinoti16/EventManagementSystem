const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Home Route
app.get("/", (req, res) => {
    res.send("Event Management System API is running!");
});

// Get All Events
app.get("/events", (req, res) => {
    db.query("SELECT * FROM events", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// Create Event
app.post("/events", (req, res) => {
    const {
        title,
        description,
        venue,
        event_date,
        event_time,
        capacity
    } = req.body;

    const sql = `
        INSERT INTO events
        (title, description, venue, event_date, event_time, capacity)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, venue, event_date, event_time, capacity],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "Event created successfully!",
                eventId: result.insertId
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});