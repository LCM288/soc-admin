/**
 * @packageDocumentation
 * @module Person
 */

import { College } from "./College";
import { Major } from "./Major";

enum GenderEnum {
  Male = "Male",
  Female = "Female",
  None = "None",
}

/** All the attributes in the Person model */
export interface Person {
  id: number;
  /** The student id of the student */
  sid: string;
  chineseName: string | null;
  englishName: string;
  gender: GenderEnum | null;
  dateOfBirth: string | null;
  email: string | null;
  phone: string | null;
  college: College;
  /** The major program's code of the student */
  major: Major;
  /** The date that the student entered the university */
  dateOfEntry: string;
  expectedGraduationDate: string;
  /**
   * The date that the student became a member of the society \
   * Null for non-member
   */
  memberSince: Date | null;
  /** The date that the membership expires, null for until grad */
  memberUntil: Date | null;
}
