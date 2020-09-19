/**
 * @packageDocumentation
 * @module Major
 */

import { DataSource } from "apollo-datasource";
import { Major } from "@/models/Major";
import { majors } from "@/json/Majors.json";

/** An API to retrieve data from the Major store */
export default class MajorAPI extends DataSource {
  private majors: Major[];

  /**
   * Create the API instance.
   */
  constructor() {
    super();
    this.majors = majors;
  }

  /**
   * Find a major program by code
   * @param {string} code - The code of the major program
   * @returns The matched major or undefined if not found
   */
  public getMajor(code: string): Major | undefined {
    return this.majors.find((m) => m.code === code);
  }

  /**
   * Find all major programs
   * @returns {Major[]} An array of major programs
   */
  public getMajors(): Major[] {
    return this.majors;
  }
}
