import { DataSource } from "apollo-datasource";
import { faculties } from "./Faculties.json";

export type Faculty = {
  code: string;
  chinese_name: string;
  english_name: string;
};

class FacultyAPI extends DataSource {
  faculties: Faculty[];

  constructor() {
    super();
    this.faculties = faculties;
  }

  getFaculty(code: string): Faculty {
    return this.faculties.find((f) => f.code === code);
  }

  getFaculties(): Faculty[] {
    return this.faculties;
  }
}

export default FacultyAPI;
