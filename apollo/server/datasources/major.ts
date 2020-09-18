import { DataSource } from "apollo-datasource";
import { Major } from "@/models/Major";
import { majors } from "@/json/Majors.json";

export default class MajorAPI extends DataSource {
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
