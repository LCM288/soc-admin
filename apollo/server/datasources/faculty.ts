import { DataSource } from "apollo-datasource";
import { faculties } from "./Faculties.json";

class FacultyAPI extends DataSource {
  constructor() {
    super();
    this.faculties = faculties;
  }

  async getFaculty(code: string): Faculty {
    return this.faculties.find((f) => f.code === code);
  }

  async getFaculties(): Faculty[] {
    return this.faculties;
  }
}

export default FacultyAPI;
export type Faculty = {
  code: string;
  chinese_name: string;
  english_name: string;
};
