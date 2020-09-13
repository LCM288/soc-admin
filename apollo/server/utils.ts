import { Sequelize, DataTypes } from "sequelize";
import { Client } from "pg";

export const createStore = () => {
  const socAdminDB = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;
  const createDB = () => {
    const client = new Client({ database: "postgres" });
    client.connect();
    client.query(`CREATE DATABASE ${process.env.PGDB}`, function(err) {
      // create user's db
      if (err) console.log("ignoring the error"); // ignore if the db is there
      client.end(); // close the connection
    });
  };

  createDB();

  const db = new Sequelize(socAdminDB);

  const tests = db.define("test", {
    message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  db.sync();

  return { db, tests };
};
