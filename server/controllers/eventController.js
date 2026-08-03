const db = require("../config/database");

// ===============================
// CREATE EVENT
// ===============================
const createEvent = (req, res) => {

    const {
    title,
    category,
    description,
    venue,
    organizer,
    event_date,
    event_time,
    capacity,
    price
} = req.body;

    const sql = `
        INSERT INTO events
(title, category, description, venue, organizer, event_date, event_time, capacity, price, status)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
    title,
    category,
    description,
    venue,
    organizer,
    event_date,
    event_time,
    capacity,
    price,
    "Upcoming"
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
            DATE_FORMAT(event_date, '%Y-%m-%d') AS startDate,
            capacity,
            description,
            category,
organizer,
price,
status
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
// GET SINGLE EVENT
// ===============================
const getEventById = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            event_id AS id,
            title AS name,
            venue,
            DATE_FORMAT(event_date, '%Y-%m-%d') AS startDate,
            capacity,
            description,
            category,
organizer,
price,
status
        FROM events
        WHERE event_id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load event."
            });
        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "Event not found."
            });

        }

        res.json(results[0]);

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
    category,
    description,
    venue,
    organizer,
    event_date,
    event_time,
    capacity,
    price,
    status
} = req.body;

    const sql = `
        UPDATE events
SET
    title = ?,
    category = ?,
    description = ?,
    venue = ?,
    organizer = ?,
    event_date = ?,
    event_time = ?,
    capacity = ?,
    price = ?,
    status = ?
WHERE event_id = ?
    `;

    db.query(
        sql,
        [
    title,
    category,
    description,
    venue,
    organizer,
    event_date,
    event_time,
    capacity,
    price,
    status,
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
    getEventById,
    deleteEvent,
    updateEvent
};
    getEvents
