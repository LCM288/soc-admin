import { Sequelize } from "sequelize";
import { Client } from "pg";
import { PersonFactory, Person } from "./models/Person";

type Store = {
  sequelize: Sequelize;
  person: typeof Person;
};

const createStore = (): Store => {
  if (process.env.NODE_ENV === "development") {
    const client = new Client({ database: "postgres" });
    client.connect();
    client.query(`CREATE DATABASE ${process.env.PGDB}`, () => {
      // create user's db ignoring any error
      client.end(); // close the connection
    });
  }

  const socAdminDB = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

  const sequelize = new Sequelize(socAdminDB);

  const person = PersonFactory(sequelize);
  // sequelize.sync({ force: true });

  return { sequelize, person };
};

export default createStore;
