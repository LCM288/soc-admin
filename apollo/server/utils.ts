import { Sequelize, DataTypes } from "sequelize";
import { Client } from "pg";
import { MemberFactory } from "../../models/member";
import { RegistrationFactory } from "../../models/registration";

const createStore = async () => {
  const socAdminDB = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;
  const createDB = async () => {
    const client = new Client({ database: "postgres" });
    client.connect();
    await new Promise((r) => {
      client.query(`CREATE DATABASE ${process.env.PGDB}`, (err) => {
        // create user's db
        if (err) console.log("ignoring the error"); // ignore if the db is there
        client.end(); // close the connection
        r();
      });
    });
  };

  await createDB();

  const db = new Sequelize(socAdminDB);

  const tests = db.define("test", {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  const members = MemberFactory(db);
  const registrations = RegistrationFactory(db);
  await db.sync();

  return { db, tests, members, registrations };
};

export default createStore;
