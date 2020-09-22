/**
 * @packageDocumentation
 * @module College
 */

import { DataSource } from "apollo-datasource";
import { College } from "@/models/College";
import { CollegeEnum } from "@/models/Person";
import { colleges } from "@/json/College.json";
import { ContextBase } from "@/types/datasources";

/** An API to retrieve data from the College store */
export default class CollegeAPI extends DataSource<ContextBase> {
  /** The College store */
  private colleges: College[];

  /**
   * Create the API instance.
   */
  constructor() {
    super();
    this.colleges = colleges;
  }

  /**
   * Find a college by code
   * @param {CollegeEnum} code - The code of the college
   * @returns {College | undefined} The matched college or undefined if not found
   */
  public getCollege(code: CollegeEnum): College {
    const college = this.colleges.find((c) => c.code === code);
    if (!college) {
      throw new Error(`Cannot find college ${code}`);
    }
    return college;
  }

  /**
   * Find all colleges
   * @returns {College[]} An array of colleges
   */
  public getColleges(): College[] {
    return this.colleges;
  }
}
