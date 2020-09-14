import { Sequelize, DataTypes } from "sequelize";
import { Client } from "pg";
import { PersonFactory } from "../../models/Person";

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

  // await createDB();

  const db = new Sequelize(socAdminDB);

  const tests = db.define("test", {
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  const Person = PersonFactory(db);
  // await db.sync();

  return { db, Person };
};

export default createStore;
