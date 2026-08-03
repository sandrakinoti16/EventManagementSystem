const db = require("../config/database");


// PARTICIPANTS REPORT
const getParticipantsReport = (req, res) => {

    const sql = `
        SELECT
            users.full_name AS name,
            users.email,
            events.title AS event,
            registrations.registration_date AS date,
            registrations.status AS attended
        FROM registrations

        JOIN users
        ON registrations.user_id = users.user_id

        JOIN events
        ON registrations.event_id = events.event_id

        ORDER BY registrations.registration_date DESC
    `;


    db.query(sql, (err, results) => {

        if(err){
            console.error(err);
            return res.status(500).json({
                message:"Failed loading participants report"
            });
        }


        const report = results.map(row => ({
            name: row.name,
            email: row.email,
            event: row.event,
            date: new Date(row.date).toLocaleDateString(),
            attended: row.attended,
            statusClass: row.attended === "Attended" ? "success" : "danger"
        }));


        res.json(report);

    });

};



// EVENTS REPORT
const getEventsReport = (req,res)=>{

    const sql = `
        SELECT
            events.title AS event,
            COUNT(registrations.registration_id) AS totalParticipants
        FROM events

        LEFT JOIN registrations
        ON events.event_id = registrations.event_id

        GROUP BY events.event_id
    `;


    db.query(sql,(err,results)=>{

        if(err){
            return res.status(500).json({
                message:"Failed loading events report"
            });
        }


        const report = results.map(row=>({
            event: row.event,
            totalParticipants: row.totalParticipants,
            totalRevenue: 0,
            rating: 0
        }));


        res.json(report);

    });

};




// ATTENDANCE REPORT
const getAttendanceReport = (req,res)=>{


    const sql = `
        SELECT
            events.title AS event,
            events.event_date AS date,
            events.capacity AS expected,
            COUNT(registrations.registration_id) AS actual

        FROM events

        LEFT JOIN registrations
        ON events.event_id = registrations.event_id

        GROUP BY events.event_id
    `;


    db.query(sql,(err,results)=>{


        if(err){
            return res.status(500).json({
                message:"Failed loading attendance report"
            });
        }


        const report = results.map(row=>({

            event: row.event,
            date: row.date ? new Date(row.date).toLocaleDateString() : "N/A",
            expected: row.expected,
            actual: row.actual,
            percentage: row.expected 
                ? Math.round((row.actual / row.expected)*100)
                : 0

        }));


        res.json(report);

    });

};



module.exports = {
    getParticipantsReport,
    getEventsReport,
    getAttendanceReport
};