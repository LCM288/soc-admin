/* eslint-disable */

require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const crypto = require("crypto");

const socAdminDB =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

const sequelize = new Sequelize(socAdminDB, {
  native: true,
  timezone: "Asia/Hong_Kong",
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
});

const socSetting = sequelize.define("soc_settings", {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const newSetting = {
  key: "jwt_secret",
  value: crypto.randomBytes(32).toString("base64"),
};

module.exports = async () => {
  const obj = await socSetting.findOne({ where: { key: "jwt_secret" } });
  if (obj) {
    // update
    await obj.update(newSetting);
    console.log("Update new jwt_secret");
  } else {
    // insert
    await socSetting.create(newSetting);
    console.log("Insert new jwt_secret");
  }
};
