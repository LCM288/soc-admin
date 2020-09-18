import { Sequelize } from "sequelize";
import { PersonFactory } from "@/models/Person";
import { ExecutiveFactory } from "@/models/Executive";
import { SocSettingFactory } from "@/models/SocSetting";

const socAdminDB =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

export const sequelize = new Sequelize(socAdminDB);

export const personStore = PersonFactory(sequelize);

export const executiveStore = ExecutiveFactory(sequelize);

export const socSettingStore = SocSettingFactory(sequelize);
