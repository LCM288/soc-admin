/* eslint-disable */

const { DataTypes } = require("sequelize");

async function up(queryInterface) {
  await queryInterface.sequelize.transaction(async (transaction) => {
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
          type: DataTypes.TEXT,
          allowNull: false,
        },
        newValue: {
          type: DataTypes.TEXT,
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
    await queryInterface.changeColumn(
      "soc_settings",
      "value",
      {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      { transaction }
    );
  });
}

async function down(queryInterface) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.changeColumn(
      "soc_settings",
      "value",
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
      { transaction }
    );
    await queryInterface.dropTable("log_entries", { transaction });
  });
}

module.exports = { up, down };
