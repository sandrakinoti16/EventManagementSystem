const db = require("../config/database");

// Register user for an event
const registerForEvent = (req, res) => {

    const { user_id, event_id } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({
            message: "User ID and Event ID are required."
        });
    }

    const checkSql = `
        SELECT *
        FROM registrations
        WHERE user_id = ? AND event_id = ?
    `;

    db.query(checkSql, [user_id, event_id], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error."
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "You are already registered for this event."
            });
        }

        const insertSql = `
            INSERT INTO registrations
            (user_id, event_id, status)
            VALUES (?, ?, 'Registered')
        `;

        db.query(insertSql, [user_id, event_id], (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Registration failed."
                });
            }

            const registration_id = result.insertId;
            const ticketNumber = "TICKET-" + Date.now();

            const ticketSql = `
                INSERT INTO tickets
                (registration_id, ticket_number)
                VALUES (?, ?)
            `;

            db.query(ticketSql, [registration_id, ticketNumber], (err) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Ticket generation failed."
                    });
                }

                res.json({
                    message: "Registration successful."
                });

            });

        });

    });

};


// Get ticket information for a user
const getUserRegistrations = (req, res) => {

    const user_id = req.params.id;

    const sql = `
    SELECT
        tickets.ticket_number,
        tickets.issue_date,
        registrations.registration_date,
        events.title AS eventName,
        users.full_name AS fullName,
        users.email
    FROM registrations

    JOIN tickets
        ON registrations.registration_id = tickets.registration_id

    JOIN events
        ON registrations.event_id = events.event_id

    JOIN users
        ON registrations.user_id = users.user_id

    WHERE registrations.user_id = ?
`;

    db.query(sql, [user_id], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error."
            });
        }

        res.json(results);

    });

};

module.exports = {
    registerForEvent,
    getUserRegistrations
};