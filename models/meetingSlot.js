const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");

const MeetingSlot = sequelize.define("meetingSlot", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
module.exports = MeetingSlot;
