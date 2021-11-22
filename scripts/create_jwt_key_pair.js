/* eslint-disable */

require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const keypair = require('keypair');

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

const pair = keypair();

const publicKeySetting = {
  key: "jwt_public_key",
  value: pair.public,
};

const privateKeySetting = {
  key: "jwt_private_key",
  value: pair.private,
};

module.exports = async () => {
  const publicKeyObj = await socSetting.findOne({ where: { key: "jwt_public_key" } });
  const privateKeyObj = await socSetting.findOne({ where: { key: "jwt_private_key" } });
  const isUpdate = Boolean(publicKeyObj || privateKeyObj);
  await socSetting.upsert(publicKeySetting);
  await socSetting.upsert(privateKeySetting);
  if (isUpdate) {
    console.log("Updated new key pair");
  } else {
    console.log("Inserted new key pair");
  }
};
