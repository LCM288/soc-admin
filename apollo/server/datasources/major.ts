import { DataSource } from "apollo-datasource";
import { majors } from "./Majors.json";

export type Major = {
  code: string;
  chinese_name: string;
  english_name: string;
  faculties: string[];
};

class MajorAPI extends DataSource {
  majors: Major[];

  constructor() {
    super();
    this.majors = majors;
  }

  getMajor(code: string): Major {
    return this.majors.find((m) => m.code === code);
  }

  getMajors(): Major[] {
    return this.majors;
  }
}

export default MajorAPI;
