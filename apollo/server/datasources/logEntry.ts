/**
 * @packageDocumentation
 * @module LogEntry
 */

import { DataSource } from "apollo-datasource";
import {
  LogEntry,
  LogEntryAttributes,
  LogEntryCreationAttributes,
} from "@/models/LogEntry";
import { ContextBase } from "@/types/datasources";
import { Transaction, Optional } from "sequelize";

/** An API to retrieve data from the LogEntry store */
export default class LogEntryAPI extends DataSource<ContextBase> {
  /** The {@link LogEntry} store */
  private store: typeof LogEntry;

  /**
   * Create the API instance.
   * @param {typeof LogEntry} logEntryStore - A LogEntry store.
   */
  constructor(logEntryStore: typeof LogEntry) {
    super();
    this.store = logEntryStore;
  }

  /**
   * Insert a new log entry
   * @async
   * @param arg - The arg for the new entry
   * @param transaction - The database transaction
   */
  public async insertLogEntry(
    {
      who,
      table,
      description,
      oldValue,
      newValue,
    }: Optional<LogEntryCreationAttributes, "who">,
    transaction: Transaction
  ): Promise<LogEntryAttributes> {
    return this.store.create(
      {
        who: who ?? "God",
        table,
        description,
        oldValue,
        newValue,
      },
      { transaction }
    );
  }

  /**
   * Count number of log entries
   * @async
   * @returns Number of log entries
   */
  public async countLogEntries(): Promise<number> {
    return this.store.count();
  }

  /**
   * Find all log entries
   * @async
   * @returns An array of log entries
   */
  public async findLogEntries(): Promise<LogEntryAttributes[]> {
    return this.store.findAll({ raw: true });
  }
}
