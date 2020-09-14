import { DataSource } from "apollo-datasource";
const { majors } = require("./Majors.json");
const { faculties } = require("./Faculties.json");
const { Faculty } = require("./faculties.ts");

class MajorsAPI extends DataSource {
  async getMajor(code): Major {
    return majors.find((m) => m.code === code);
  }

  async getMajors(): Major[] {
    return majors;
  }
}

export default MajorsAPI;
export type Major = {
  code: string;
  chinese_name: string;
  english_name: string;
  faculties: Faculty[];
};
