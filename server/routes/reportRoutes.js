const express = require("express");

const router = express.Router();


const {
    getParticipantsReport,
    getEventsReport,
    getAttendanceReport

} = require("../controllers/reportController");



router.get("/participants", getParticipantsReport);

router.get("/events", getEventsReport);

router.get("/attendance", getAttendanceReport);



module.exports = router;