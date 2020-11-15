/* eslint-disable */

const { DataTypes } = require("sequelize");

async function up(queryInterface) {
  await queryInterface.sequelize.transaction(async (transaction) => {
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
          values: ["Male", "Female", "None"],
        },
        dateOfBirth: {
          type: DataTypes.DATEONLY,
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
            "MC",
            "SHHO",
            "CW",
            "WYS",
            "LWS",
            "GS",
            "None",
          ],
          allowNull: false,
        },
        major: {
          type: DataTypes.STRING(8),
          allowNull: false,
        },
        dateOfEntry: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        expectedGraduationDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        memberSince: {
          type: DataTypes.DATE,
        },
        memberUntil: {
          type: DataTypes.DATEONLY,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        transaction,
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
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        transaction,
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
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        transaction,
      }
    );
  });
}

async function down(queryInterface) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable("soc_settings", { transaction });
    await queryInterface.dropTable("executives", { transaction });
    await queryInterface.dropTable("people", { transaction });
  });
}

module.exports = { up, down };
