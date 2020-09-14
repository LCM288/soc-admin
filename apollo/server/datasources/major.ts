import { DataSource } from "apollo-datasource";

import { majors } from "./Majors.json";
import { Faculty } from "./faculty";

class MajorAPI extends DataSource {
  constructor() {
    super();
    this.majors = majors;
  }

  async getMajor(code): Major {
    return this.majors.find((m) => m.code === code);
  }

  async getMajors(): Major[] {
    return this.majors;
  }
}

export default MajorAPI;
export type Major = {
  code: string;
  chinese_name: string;
  english_name: string;
  faculties: Faculty[];
};
