const db = require("../config/database");
const bcrypt = require("bcrypt");

// ======================
// REGISTER USER
// ======================
const registerUser = async (req, res) => {

    console.log("========== REGISTER REQUEST ==========");
    console.log("Request Body:", req.body);

    const { fullName, email, password } = req.body;

    try {

        const checkSql = "SELECT * FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, results) => {

            if (err) {
                console.error("Database Error (SELECT):", err);

                return res.status(500).json({
                    message: err.message
                });
            }

            if (results.length > 0) {
                console.log("Email already exists.");

                return res.status(400).json({
                    message: "Email already exists."
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertSql = `
                INSERT INTO users
                (full_name, email, password)
                VALUES (?, ?, ?)
            `;

            db.query(insertSql, [fullName, email, hashedPassword], (err, result) => {

                if (err) {
                    console.error("Database Error (INSERT):", err);

                    return res.status(500).json({
                        message: err.message
                    });
                }

                console.log("User registered successfully.");
                console.log("Inserted ID:", result.insertId);

                return res.status(201).json({
                    message: "Registration Successful!"
                });

            });

        });

    } catch (error) {

        console.error("Server Error:", error);

        return res.status(500).json({
            message: error.message
        });

    }

};

// ======================
// LOGIN USER
// ======================
const loginUser = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        req.session.user = {
            id: user.user_id, // Fixed from user.id
            fullName: user.full_name,
            email: user.email,
            role: user.role
        };

        console.log("User Logged In:");
        console.log(req.session.user);

        return res.status(200).json({
            message: "Login Successful!",
            user: req.session.user
        });

    });

};

// ======================
// LOGOUT USER
// ======================
const logoutUser = (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Logout failed."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message: "Logged out successfully."
        });

    });

};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};