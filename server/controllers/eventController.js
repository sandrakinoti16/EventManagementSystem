const db = require("../config/database");

// ===============================
// CREATE EVENT
// ===============================
const createEvent = (req, res) => {

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
        [
            title,
            description,
            venue,
            event_date,
            event_time,
            capacity
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to create event."
                });
            }

            res.status(201).json({
                message: "Event created successfully!",
                eventId: result.insertId
            });

        }
    );

};

// ===============================
// GET ALL EVENTS
// ===============================
const getEvents = (req, res) => {

    const sql = `
        SELECT
            event_id AS id,
            title AS name,
            venue,
            event_date AS startDate,
            capacity,
            description,
            'General' AS category,
            'System' AS organizer,
            event_date AS endDate,
            0 AS price,
            'Upcoming' AS status
        FROM events
        ORDER BY event_date ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Failed to load events."
            });

        }

        res.json(results);

    });

};
// ===============================
// DELETE EVENT
// ===============================
const deleteEvent = (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM events WHERE event_id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to delete event."
            });
        }

        res.json({
            message: "Event deleted successfully!"
        });

    });

};
// ===============================
// UPDATE EVENT
// ===============================
const updateEvent = (req, res) => {

    const id = req.params.id;

    const {
        title,
        description,
        venue,
        event_date,
        event_time,
        capacity
    } = req.body;

    const sql = `
        UPDATE events
        SET
            title = ?,
            description = ?,
            venue = ?,
            event_date = ?,
            event_time = ?,
            capacity = ?
        WHERE event_id = ?
    `;

    db.query(
        sql,
        [
            title,
            description,
            venue,
            event_date,
            event_time,
            capacity,
            id
        ],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update event."
                });
            }

            res.json({
                message: "Event updated successfully!"
            });

        }
    );

};
module.exports = {
    createEvent,
    getEvents,
    deleteEvent,
    updateEvent
};
    getEvents
