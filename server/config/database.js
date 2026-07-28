const mysql = require("mysql2");

// Create MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "event_management"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }

    console.log("✅ Connected to MySQL Database");
});

module.exports = db;