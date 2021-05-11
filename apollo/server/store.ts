import { Sequelize, Transaction } from "sequelize";
import { PersonFactory } from "@/models/Person";
import { ExecutiveFactory } from "@/models/Executive";
import { SocSettingFactory } from "@/models/SocSetting";
import { LogEntryFactory } from "@/models/LogEntry";

/**
 * The url to the database
 * @internal
 */
const socAdminDB =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDB}`;

/**
 * A database connection
 */
export const sequelize = new Sequelize(socAdminDB, {
  native: true,
  timezone: "Asia/Hong_Kong",
  isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
});

/**
 * A store for the Person model
 */
export const personStore = PersonFactory(sequelize);

/**
 * A store for the Executive model
 */
export const executiveStore = ExecutiveFactory(sequelize);

/**
 * A store for the SocSetting model
 */
export const socSettingStore = SocSettingFactory(sequelize);

/**
 * A store for the Log model
 */
export const logEntryStore = LogEntryFactory(sequelize);
