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
   * @returns {Major} The matched major or null if not found
   */
  public getMajor(code: string): Major | null {
    return this.majors.find((m) => m.code === code) || null;
  }

  /**
   * Find all major programs
   * @returns {Major[]} An array of major programs
   */
  public getMajors(): Major[] {
    return this.majors;
  }
}
