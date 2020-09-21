/* eslint-disable */

const Sequelize = require("sequelize");
const Umzug = require("umzug");
require("dotenv").config();

const socAdminDB =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

const sequelize = new Sequelize(socAdminDB);

const umzug = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: __dirname,
    // inject sequelize's QueryInterface in the migrations
    params: [sequelize.getQueryInterface()],
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: "sequelize",
  storageOptions: {
    sequelize,
  },
});

(async () => {
  // checks migrations and run them if they are not already applied
  await umzug.up();
  console.log("All migrations performed successfully");
})();
