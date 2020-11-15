/* eslint-disable */

const { DataTypes } = require("sequelize");

async function up(queryInterface) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.createTable(
      "log_entries",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        who: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        table: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        oldValue: {
          type: DataTypes.STRING,
        },
        newValue: {
          type: DataTypes.STRING,
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
        transaction: t,
      }
    );
  });
}

async function down(queryInterface) {
  await queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.dropTable("log_entries", { transaction: t });
  });
}

module.exports = { up, down };
