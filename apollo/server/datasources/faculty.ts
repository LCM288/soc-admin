/**
 * @packageDocumentation
 * @module Faculty
 */

import { DataSource } from "apollo-datasource";
import { Faculty } from "@/models/Faculty";
import { faculties } from "@/json/Faculties.json";

/** An API to retrieve data from the Faculty store */
export default class FacultyAPI extends DataSource {
  /** The Executive store */
  private faculties: Faculty[];

  /**
   * Create the API instance.
   */
  constructor() {
    super();
    this.faculties = faculties;
  }

  /**
   * Find a facultiy by code
   * @param {string} code - The code of the faculty
   * @returns {Faculty | null} The matched faculty or null if not found
   */
  public getFaculty(code: string): Faculty | null {
    return this.faculties.find((f) => f.code === code) || null;
  }

  /**
   * Find all faculties
   * @returns {Faculty[]} An array of faculties
   */
  public getFaculties(): Faculty[] {
    return this.faculties;
  }
}
