const db = require("../config/database");
const bcrypt = require("bcrypt");


const registerUser = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {

        const checkSql = "SELECT * FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (results.length > 0) {
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

            db.query(insertSql, [fullName, email, hashedPassword], (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Registration failed."
                    });
                }

                return res.status(201).json({
                    message: "Registration Successful!"
                });

            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Server Error"
        });

    }

};


const loginUser = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
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
            id: user.id,
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


const logoutUser = (req, res) => {

    req.session.destroy((err) => {

        if (err) {
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