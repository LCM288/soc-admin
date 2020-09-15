import { DataSource } from "apollo-datasource";
import { Faculty } from "../models/Faculty";
import { faculties } from "./Faculties.json";

export default class FacultyAPI extends DataSource {
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
