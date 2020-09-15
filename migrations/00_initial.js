/* eslint-disable */

const { Sequelize, DataTypes } = require("sequelize");

async function up(queryInterface) {
  await queryInterface.createTable("people", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    sid: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    chineseName: {
      type: DataTypes.STRING(20),
    },
    englishName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["Male", "Female"],
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING(30),
    },
    college: {
      type: DataTypes.ENUM,
      values: ["CC", "UC", "NA", "SC", "WS", "WYS", "SHHO", "MC", "CW", "None"],
      allowNull: false,
    },
    major: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    dateOfEntry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expectedGraduationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable("people");
}

module.exports = { up, down };
