const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Meeting = sequelize.define("meeting", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  slots: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Meeting;
