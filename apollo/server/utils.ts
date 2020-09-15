import { Sequelize } from "sequelize";
import { Client } from "pg";
import { PersonFactory } from "./models/Person";

const createStore = () => {
  if (process.env.NODE_ENV === "development") {
    const client = new Client({ database: "postgres" });
    client.connect();
    client.query(`CREATE DATABASE ${process.env.PGDB}`, (err) => {
      // create user's db ignoring any error
      client.end(); // close the connection
    });
  }

  const socAdminDB = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

  const sequelize = new Sequelize(socAdminDB);

  const Person = PersonFactory(sequelize);
  // sequelize.sync({ force: true });

  return { sequelize, Person };
};

export default createStore;
