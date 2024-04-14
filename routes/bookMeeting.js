const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");

// Routes for meetings
router.post("/meetings/:meetingId/", meetingController.bookMeeting);
router.get("/all-booked-meetings", meetingController.getAllBookedMeetings);
router.delete("/cancel-meeting/:userId", meetingController.cancelMeeting);

module.exports = router;
