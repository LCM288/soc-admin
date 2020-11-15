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
import LogEntryAPI from "@/datasources/logEntry";
import Sequelize from "sequelize";

/** An API to retrieve data from the Executive store */
export default class ExecutiveAPI extends DataSource<ContextBase> {
  /** The {@link Executive} store */
  private store: typeof Executive;

  /** The logger */
  private logger: LogEntryAPI;

  /** The sequelize connection */
  private sequelize: Sequelize.Sequelize;

  /**
   * Create the API instance.
   * @param {typeof Executive} executiveStore - A Executive store.
   */
  constructor(
    executiveStore: typeof Executive,
    logger: LogEntryAPI,
    sequelize: Sequelize.Sequelize
  ) {
    super();
    this.store = executiveStore;
    this.logger = logger;
    this.sequelize = sequelize;
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
   * @param arg - The arg for the new executive
   * @param who - Who performed the action
   * @returns An instance of the new executive
   */
  public async addNewExecutive(
    arg: ExecutiveCreationAttributes,
    who: string | undefined
  ): Promise<ExecutiveAttributes> {
    return this.sequelize.transaction(async (transaction) => {
      const executive = await this.store.findOne({
        where: { sid: arg.sid },
        raw: true,
        transaction,
      });
      if (executive) {
        throw new Error(`SID ${arg.sid} is an executive already`);
      }
      const newExecutive = (await this.store.create(arg, { transaction })).get({
        plain: true,
      });
      await this.logger.insertLogEntry(
        {
          who,
          table: this.store.tableName,
          description: "A new executive has been added",
          oldValue: null,
          newValue: JSON.stringify(newExecutive),
        },
        transaction
      );
      return newExecutive;
    });
  }

  /**
   * Update an executive
   * @async
   * @param arg - The arg for updating the executive
   * @param who - Who performed the action
   * @returns The updated executive
   */
  public async updateExecutive(
    arg: ExecutiveUpdateAttributes,
    who: string | undefined
  ): Promise<ExecutiveAttributes> {
    return this.sequelize.transaction(async (transaction) => {
      const oldExecutive = await this.store.findOne({
        where: { sid: arg.sid },
        raw: true,
        transaction,
      });
      if (!oldExecutive) {
        throw new Error(`SID ${arg.sid} is not an executive`);
      }
      const [count, executives] = await this.store.update(arg, {
        where: { sid: arg.sid },
        returning: true,
        transaction,
      });
      if (!count) {
        throw new Error(`Cannot update executive record for sid ${arg.sid}`);
      }
      const newExecutive = executives[0].get({ plain: true });
      await this.logger.insertLogEntry(
        {
          who,
          table: this.store.tableName,
          description: `Executive ${arg.sid} has been updated`,
          oldValue: JSON.stringify(oldExecutive),
          newValue: JSON.stringify(newExecutive),
        },
        transaction
      );
      return newExecutive;
    });
  }

  /**
   * Remove executive
   * @async
   * @param sid - The arg for the executive
   * @param who - Who performed the action
   * @returns Number of executives deleted
   */
  public async removeExecutive(
    sid: string,
    who: string | undefined
  ): Promise<number> {
    return this.sequelize.transaction(async (transaction) => {
      const oldExecutive = await this.store.findOne({
        where: { sid },
        raw: true,
        transaction,
      });
      const count = await this.store.destroy({ where: { sid }, transaction });
      if (oldExecutive) {
        await this.logger.insertLogEntry(
          {
            who,
            table: this.store.tableName,
            description: `Executive ${sid} has been removed`,
            oldValue: JSON.stringify(oldExecutive),
            newValue: null,
          },
          transaction
        );
      }
      return count;
    });
  }
}
