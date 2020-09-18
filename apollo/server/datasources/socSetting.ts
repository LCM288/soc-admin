import { DataSource } from "apollo-datasource";
import {
  SocSetting,
  SocSettingAttributes,
  SocSettingCreationAttributes,
} from "@/models/SocSetting";
import { ContextBase } from "@/types/datasources";

const transformData = (socSetting: SocSetting): SocSettingAttributes => {
  return socSetting.get({ plain: true });
};

export default class SocSettingAPI extends DataSource<ContextBase> {
  private store: typeof SocSetting;

  constructor(socSettingStore: typeof SocSetting) {
    super();
    this.store = socSettingStore;
  }

  public async findSocSettings(): Promise<SocSettingAttributes[]> {
    const socSettings = await this.store.findAll();
    return socSettings.map(transformData);
  }

  public async addNewSocSetting(
    arg: SocSettingCreationAttributes
  ): Promise<SocSettingAttributes> {
    const socSetting = await this.store.create(arg);
    return transformData(socSetting);
  }
}
