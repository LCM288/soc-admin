/* eslint-disable */

const { Sequelize, DataTypes } = require("sequelize");

async function up(queryInterface) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.createTable(
      "people",
      {
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
          values: [
            "CC",
            "UC",
            "NA",
            "SC",
            "WS",
            "WYS",
            "SHHO",
            "MC",
            "CW",
            "None",
          ],
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
        memberSince: {
          type: Sequelize.DATE,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        transaction: t,
      }
    );
    await queryInterface.createTable(
      "executives",
      {
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
        nickname: {
          type: DataTypes.STRING(20),
        },
        pos: {
          type: DataTypes.STRING(20),
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        transaction: t,
      }
    );
    await queryInterface.createTable(
      "soc_settings",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        key: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        value: {
          type: DataTypes.STRING,
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
      },
      {
        transaction: t,
      }
    );
  });
}

async function down(queryInterface) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.dropTable("people", { transaction: t });
    await queryInterface.dropTable("executives", { transaction: t });
    await queryInterface.dropTable("soc_settings", { transaction: t });
  });
}

module.exports = { up, down };
