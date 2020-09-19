/**
 * @packageDocumentation
 * @module SocSetting
 */

import { DataSource } from "apollo-datasource";
import {
  SocSetting,
  SocSettingAttributes,
  SocSettingCreationAttributes,
  SocSettingDestroyAttributes,
} from "@/models/SocSetting";
import { ContextBase } from "@/types/datasources";

/**
 * Transforms the data from the SocSetting model to plain attributes
 * @internal
 * @param {SocSetting} socSetting - An instance of the SocSetting model
 * @returns {SocSettingAttributes} Plain attributes for the SocSetting instance
 */
const transformData = (socSetting: SocSetting): SocSettingAttributes => {
  return socSetting?.get({ plain: true });
};

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
    const socSettings = await this.store.findAll();
    return socSettings.map(transformData);
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
    return transformData(socSetting);
  }

  /**
   * Delete soc settings
   * @async
   * @param {SocSettingDestroyAttributes} arg - The arg for the soc setting
   * @returns {Promise<number>} Number of soc settings deleted
   */
  public async deleteSocSetting(
    arg: SocSettingDestroyAttributes
  ): Promise<number> {
    const count = await this.store.destroy({ where: arg });
    return count;
  }
}
