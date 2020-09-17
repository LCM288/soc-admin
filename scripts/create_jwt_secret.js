/* eslint-disable */

require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const crypto = require("crypto");

const socAdminDB =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

const sequelize = new Sequelize(socAdminDB);

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
  value: crypto.randomBytes(127).toString("base64"),
};

socSetting.findOne({ where: { key: "jwt_secret" } }).then(function (obj) {
  if (obj) {
    // update
    obj.update(newSetting);
  } else {
    // insert
    socSetting.create(newSetting);
  }
});
