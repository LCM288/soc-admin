import { Sequelize } from "sequelize";
import fs from "fs";
import { PersonFactory, Person } from "./models/Person";
import { ExecutiveFactory, Executive } from "./models/Executive";
import { SocSettingFactory, SocSetting } from "./models/SocSetting";

type Store = {
  sequelize: Sequelize;
  person: typeof Person;
  executive: typeof Executive;
  socSetting: typeof SocSetting;
};

export const createStore = (): Store => {
  const socAdminDB =
    process.env.DATABASE_URL ||
    `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

  const sequelize = new Sequelize(socAdminDB);

  const person = PersonFactory(sequelize);

  const executive = ExecutiveFactory(sequelize);

  const socSetting = SocSettingFactory(sequelize);

  return { sequelize, person, executive, socSetting };
};

export const getJwtSecret = (): string | undefined => {
  try {
    const jwtSecret = fs.readFileSync(`./.jwt_secret`);
    return jwtSecret.toString();
  } catch {
    return undefined;
  }
};
