/**
 * @packageDocumentation
 * @module SocSetting
 */

import { DataSource } from "apollo-datasource";
import {
  SocSetting,
  SocSettingAttributes,
  SocSettingCreationAttributes,
} from "@/models/SocSetting";
import { ContextBase } from "@/types/datasources";
import LogEntryAPI from "@/datasources/logEntry";
import Sequelize from "sequelize";
import publicSocSettings from "utils/socSettings";

/** An API to retrieve data from the SocSetting store */
export default class SocSettingAPI extends DataSource<ContextBase> {
  /** The {@link SocSetting} store */
  private store: typeof SocSetting;

  /** The logger */
  private logger: LogEntryAPI;

  /** The sequelize connection */
  private sequelize: Sequelize.Sequelize;

  /**
   * Create the API instance.
   * @param {typeof SocSetting} socSettingStore - A SocSetting store.
   */
  constructor(
    socSettingStore: typeof SocSetting,
    logger: LogEntryAPI,
    sequelize: Sequelize.Sequelize
  ) {
    super();
    this.store = socSettingStore;
    this.logger = logger;
    this.sequelize = sequelize;
  }

  /**
   * Find all soc settings
   * @async
   * @returns {Promise<SocSettingAttributes[]>} An array of soc settings
   */
  public async findSocSettings(): Promise<SocSettingAttributes[]> {
    return this.store.findAll({ raw: true });
  }

  /**
   * Find a specific soc setting
   * @async
   * @returns {Promise<SocSettingAttributes | null>} The sepecified soc settings or null
   */
  public async findSocSetting(
    key: string
  ): Promise<SocSettingAttributes | null> {
    return this.store.findOne({ where: { key }, raw: true });
  }

  /**
   * Add or update a new soc setting
   * @async
   * @param {SocSettingCreationAttributes} arg - The arg for the soc setting
   * @returns {Promise<SocSettingAttributes>} An instance of the soc setting
   */
  public async updateSocSetting(
    arg: SocSettingCreationAttributes,
    who: string | undefined
  ): Promise<SocSettingAttributes> {
    return this.sequelize.transaction(async (transaction) => {
      const oldSetting = await this.store.findOne({
        where: { key: arg.key },
        raw: true,
        transaction,
      });
      const [socSetting] = await this.store.upsert(arg, { transaction });
      const newSetting = socSetting.get({ plain: true });
      const isPublic = Object.values(publicSocSettings)
        .map((setting) => setting.key)
        .includes(arg.key);
      const getOldValue = (): Partial<SocSettingAttributes> => {
        if (isPublic && oldSetting) {
          return oldSetting;
        }
        if (oldSetting) {
          return { key: arg.key };
        }
        return {};
      };
      await this.logger.insertLogEntry(
        {
          who,
          table: this.store.tableName,
          description: `Setting ${arg.key} has been ${
            oldSetting ? "updated" : "created"
          }`,
          oldValue: getOldValue(),
          newValue: isPublic ? newSetting : { key: arg.key },
        },
        transaction
      );
      return newSetting;
    });
  }

  /**
   * Delete soc settings
   * @async
   * @param key - The key for the soc setting
   * @returns Number of soc settings deleted
   */
  public async deleteSocSetting(
    key: string,
    who: string | undefined
  ): Promise<number> {
    return this.sequelize.transaction(async (transaction) => {
      const oldSetting = await this.store.findOne({
        where: { key },
        raw: true,
        transaction,
      });
      const count = await this.store.destroy({ where: { key }, transaction });
      if (oldSetting) {
        const isPublic = Object.values(publicSocSettings)
          .map((setting) => setting.key)
          .includes(key);
        await this.logger.insertLogEntry(
          {
            who,
            table: this.store.tableName,
            description: `Setting ${key} has been removed`,
            oldValue: isPublic ? (oldSetting as SocSettingAttributes) : { key },
            newValue: {},
          },
          transaction
        );
      }
      return count;
    });
  }
}
