const db = require("../config/database");

const getDashboardStats = (req, res) => {

    const sql = `
    SELECT
        (SELECT COUNT(*) FROM events) AS totalEvents,

        (SELECT COUNT(*) FROM registrations) AS totalParticipants,

        (SELECT COUNT(*) FROM tickets) AS totalTickets,

        (SELECT COUNT(*) FROM tickets) * 1000 AS totalTicketSales,

        4.8 AS averageRating
`;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load dashboard statistics."
            });
        }

     res.json({
    totalEvents: results[0].totalEvents,
    totalParticipants: results[0].totalParticipants,
    totalTickets: results[0].totalTickets,
    totalTicketSales: results[0].totalTicketSales,
    averageRating: results[0].averageRating
});

    });

};
const getUpcomingEvents = (req, res) => {

    const sql = `
    SELECT
        event_id,
        title AS name,
        venue AS location,
        event_date,
        capacity
    FROM events
    ORDER BY event_date ASC
    LIMIT 5
`;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to load upcoming events."
            });
        }

        const events = results.map(event => ({

            id: event.event_id,
            name: event.name,
            date: new Date(event.event_date).toLocaleDateString(),
            location: event.location,
            participants: event.capacity,
            status: "Upcoming",
            statusClass: "success"

        }));

        res.json(events);

    });

};
const getChartData = (req, res) => {

    const registrationSQL = `
        SELECT 
            DATE(registration_date) AS date,
            COUNT(*) AS total
        FROM registrations
        GROUP BY DATE(registration_date)
        ORDER BY date ASC
        LIMIT 30
    `;

    const locationSQL = `
        SELECT
            location,
            COUNT(*) AS total
        FROM users
        WHERE location IS NOT NULL
        GROUP BY location
    `;


    db.query(registrationSQL, (err, registrationResults) => {

        if (err) {
            return res.status(500).json({
                message: "Failed loading registration chart."
            });
        }


        db.query(locationSQL, (err, locationResults) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed loading demographics chart."
                });
            }


            res.json({

                registrations30Days: {
                    labels: registrationResults.map(item => item.date),
                    values: registrationResults.map(item => item.total)
                },

                demographics: {
                    labels: locationResults.map(item => item.location),
                    values: locationResults.map(item => item.total)
                }

            });

        });

    });

};
const getRecentActivity = (req, res) => {

    const sql = `
        SELECT
            users.full_name,
            events.title,
            registrations.registration_date
        FROM registrations

        JOIN users
        ON registrations.user_id = users.user_id

        JOIN events
        ON registrations.event_id = events.event_id

        ORDER BY registrations.registration_date DESC

        LIMIT 5
    `;


    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Failed loading activity."
            });
        }


        const activities = results.map(row => ({
            text: `<strong>${row.full_name}</strong> registered for ${row.title}`,
            time: new Date(row.registration_date).toLocaleDateString(),
            type: "success"
        }));

        res.json(activities);

    });

};
const getReportsData = (req, res) => {

    const type = req.params.type;


    if(type === "participants") {

        const sql = `
            SELECT
                users.full_name AS name,
                users.email,
                events.title AS event,
                registrations.registration_date AS date,
                registrations.status
            FROM registrations

            JOIN users
            ON registrations.user_id = users.user_id

            JOIN events
            ON registrations.event_id = events.event_id
        `;


        db.query(sql,(err,results)=>{

            if(err){
                return res.status(500).json(err);
            }


           const data = results.map(row=>({
    name: row.name,
    email: row.email,
    event: row.event,
    date: new Date(row.date).toLocaleDateString(),

    attended: row.status === "Registered" ? "No" : row.status,

    statusClass: row.status === "Registered" ? "warning" : "success"
}));

            res.json(data);

        });

    }


};

module.exports = {
    getDashboardStats,
    getUpcomingEvents,
    getChartData,
    getRecentActivity,
    getReportsData
};