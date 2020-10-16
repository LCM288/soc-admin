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

/** An API to retrieve data from the SocSetting store */
export default class SocSettingAPI extends DataSource<ContextBase> {
  /** The {@link SocSetting} store */
  private store: typeof SocSetting;

  /**
   * Create the API instance.
   * @param {typeof SocSetting} socSettingStore - A SocSetting store.
   */
  constructor(socSettingStore: typeof SocSetting) {
    super();
    this.store = socSettingStore;
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
   * @returns {Promise<SocSettingAttributes | >} An array of soc settings
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
    arg: SocSettingCreationAttributes
  ): Promise<SocSettingAttributes> {
    const [socSetting] = await this.store.upsert(arg);
    return socSetting.get({ plain: true });
  }

  /**
   * Delete soc settings
   * @async
   * @param {{ key: string }} arg - The arg for the soc setting
   * @returns {Promise<number>} Number of soc settings deleted
   */
  public async deleteSocSetting(arg: { key: string }): Promise<number> {
    const count = await this.store.destroy({ where: arg });
    return count;
  }
}
