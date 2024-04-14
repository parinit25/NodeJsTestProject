const sequelize = require("./utils/database");
const express = require("express");
const Meeting = require("./models/meeting");
const User = require("./models/user");
const meetingRoutes = require("./routes/meeting");
const bookMeetingRoutes = require("./routes/bookMeeting");
const app = express();
app.use(express.json());

Meeting.belongsToMany(User, {
  through: "bookedMeetings",
  as: "bookedUsers", // Set the association alias here
});

// In your User model
User.belongsToMany(Meeting, {
  through: "bookedMeetings",
  as: "bookedUsers", // Set the association alias here
});

// Define routes
app.use("/meetings", meetingRoutes);
app.use("/book-meeting", bookMeetingRoutes);

const initializeServer = async () => {
  try {
    await sequelize.sync();
    const meeting = await Meeting.findOne();
    if (!meeting) {
      await Meeting.create({ time: "15:00:00", slots: 4 });
    }
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Error occurred while initializing server:", error);
  }
};

initializeServer();
