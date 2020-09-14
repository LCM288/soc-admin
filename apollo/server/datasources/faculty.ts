import { faculties } from "./Faculties.json";

export type Faculty = {
  code: string;
  chinese_name: string;
  english_name: string;
};

const FacultyAPI = {
  getFaculty(code: string): Faculty {
    return faculties.find((f) => f.code === code);
  },
  getFaculties(): Faculty[] {
    return faculties;
  },
};

export default FacultyAPI;
