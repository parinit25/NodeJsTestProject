const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");

// Routes for meetings
router.post("/", meetingController.createMeeting);
router.get("/", meetingController.getAllMeetings);
router.get("/meetings/:meetingId", meetingController.getMeetingById);


module.exports = router;
