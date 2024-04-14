// meetingController.js

// Assuming you have already imported the necessary modules
const User = require("../models/user");
const Meeting = require("../models/meeting");
const sequelize = require("sequelize");

// Controller functions for meetings
exports.createMeeting = async (req, res) => {
  try {
    const newMeeting = await Meeting.create(req.body);
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll();
    res.json(meetings);
  } catch (error) {
    console.log(error);
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(meeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Controller function for booking a meeting
exports.bookMeeting = async (req, res) => {
  try {
    const { username, email } = req.body;
    const meetingId = req.params.meetingId;
    let userId;
    let [user] = await User.findOrCreate({
      where: { username, email },
    });
    userId = user.id;
    const meeting = await Meeting.findByPk(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    const bookedUsers = await meeting.getBookedUsers();
    const userAlreadyBooked = bookedUsers.some(
      (bookedUser) => bookedUser.id === userId
    );
    if (userAlreadyBooked) {
      return res
        .status(409)
        .json({ message: "Meeting already booked by this user" });
    } else {
      if (meeting.slots <= 0) {
        return res
          .status(400)
          .json({ message: "No slots available for this meetings" });
      } else {
        await meeting.addBookedUser(user);
        await meeting.decrement("slots");
        return res
          .status(201)
          .json({ message: "Meeting created successfully" });
      }
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.cancelMeeting = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find the user
      const user = await User.findByPk(userId, {
        include: {
          model: Meeting,
          as: 'bookedUsers' // Assuming this is the alias for the association
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the meetings booked by the user
      const bookedMeetings = user.bookedUsers;
      
      // Increment the slots count for each meeting and destroy it
      for (const meeting of bookedMeetings) {
        await meeting.increment("slots");
        await meeting.bookedMeetings.destroy(); // Assuming this is the name of the association
      }
  
      return res.status(200).json({ message: "Meetings Cancelled Successfully" });
    } catch (error) {
      console.error("Error cancelling meetings:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  

exports.getAllBookedMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      include: [
        {
          model: User,
          as: "bookedUsers",
        },
      ],
    });
    const formattedMeetings = meetings.map((meeting) => {
      return {
        meetingId: meeting.id,
        meetingName: meeting.name,
        slots: meeting.slots,
        bookedUsers: meeting.bookedUsers
          ? meeting.bookedUsers.map((user) => ({
              userId: user.id,
              username: user.username,
              email: user.email,
            }))
          : [],
      };
    });

    return res.status(200).json({ meetings: formattedMeetings });
  } catch (error) {
    console.error("Error fetching booked meetings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
