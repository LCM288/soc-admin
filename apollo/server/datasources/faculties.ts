import { DataSource } from "apollo-datasource";
const { faculties } = require("./Faculties.json");

class FacultiesAPI extends DataSource {
  async getFaculty(code): Faculty {
    return faculties.find((f) => f.code === code);
  }

  async getFaculties(): Faculty[] {
    return faculties;
  }
}

export default FacultiesAPI;
export type Faculty = {
  code: string;
  chinese_name: string;
  english_name: string;
};
