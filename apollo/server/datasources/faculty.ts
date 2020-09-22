/**
 * @packageDocumentation
 * @module Faculty
 */

import { DataSource } from "apollo-datasource";
import { Faculty } from "@/models/Faculty";
import { faculties } from "@/json/Faculties.json";
import { ContextBase } from "@/types/datasources";

/** An API to retrieve data from the Faculty store */
export default class FacultyAPI extends DataSource<ContextBase> {
  /** The Faculty store */
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
   * @returns {Faculty | undefined} The matched faculty or undefined if not found
   */
  public getFaculty(code: string): Faculty | undefined {
    return this.faculties.find((f) => f.code === code);
  }

  /**
   * Find all faculties
   * @returns {Faculty[]} An array of faculties
   */
  public getFaculties(): Faculty[] {
    return this.faculties;
  }
}
