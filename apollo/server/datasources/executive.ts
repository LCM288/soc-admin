/**
 * @packageDocumentation
 * @module Executive
 */

import { DataSource } from "apollo-datasource";
import {
  Executive,
  ExecutiveAttributes,
  ExecutiveCreationAttributes,
  ExecutiveUpdateAttributes,
} from "@/models/Executive";
import { ContextBase } from "@/types/datasources";

/** An API to retrieve data from the Executive store */
export default class ExecutiveAPI extends DataSource<ContextBase> {
  /** The {@link Executive} store */
  private store: typeof Executive;

  /**
   * Create the API instance.
   * @param {typeof Executive} executiveStore - A Executive store.
   */
  constructor(executiveStore: typeof Executive) {
    super();
    this.store = executiveStore;
  }

  /**
   * Find executive by sid
   * @async
   * @returns An instance of executive or null if not found
   */
  public async findExecutive(sid: string): Promise<ExecutiveAttributes | null> {
    return this.store.findOne({ where: { sid }, raw: true });
  }

  /**
   * Count number of executive
   * @async
   * @returns Number of executives
   */
  public async countExecutives(): Promise<number> {
    return this.store.count();
  }

  /**
   * Find all executives
   * @async
   * @returns {Promise<ExecutiveAttributes[]>} An array of executives
   */
  public async findExecutives(): Promise<ExecutiveAttributes[]> {
    return this.store.findAll({ raw: true });
  }

  /**
   * Add a new executive
   * @async
   * @param {ExecutiveCreationAttributes} arg - The arg for the new executive
   * @returns {Promise<ExecutiveAttributes>} An instance of the new executive
   */
  public async addNewExecutive(
    arg: ExecutiveCreationAttributes
  ): Promise<ExecutiveAttributes> {
    return (await this.store.create(arg)).get({ plain: true });
  }

  /**
   * Update an executive
   * @async
   * @param arg - The arg for updating the executive
   * @returns The updated executive
   */
  public async updateExecutive(
    arg: ExecutiveUpdateAttributes
  ): Promise<ExecutiveAttributes> {
    const [count, executives] = await this.store.update(arg, {
      where: { sid: arg.sid },
      returning: true,
    });
    if (!count) {
      throw new Error(`Cannot update executive record for sid ${arg.sid}`);
    }
    return executives[0].get({ plain: true });
  }

  /**
   * Delete executive
   * @async
   * @param {{ key: string }} arg - The arg for the executive
   * @returns {Promise<number>} Number of executives deleted
   */
  public async deleteExecutive(arg: { sid: string }): Promise<number> {
    const count = await this.store.destroy({ where: arg });
    return count;
  }
}
