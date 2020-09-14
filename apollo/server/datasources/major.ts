import { majors } from "./Majors.json";
import { Faculty } from "./faculty";

export type Major = {
  code: string;
  chinese_name: string;
  english_name: string;
  faculties: Faculty[];
};

const MajorAPI = {
  getMajor(code: string): Major {
    return majors.find((m) => m.code === code);
  },
  getMajors(): Major[] {
    return majors;
  },
};

export default MajorAPI;
