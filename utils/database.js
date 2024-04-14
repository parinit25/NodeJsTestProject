const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testproject", "root", "Node@12345", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize