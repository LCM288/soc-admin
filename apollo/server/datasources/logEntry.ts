/**
 * @packageDocumentation
 * @module LogEntry
 */

import { DataSource } from "apollo-datasource";
import { LogEntry, LogEntryAttributes } from "@/models/LogEntry";
import { ContextBase } from "@/types/datasources";
import { Transaction } from "sequelize";
import { union, pick } from "lodash";

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
    }: {
      who: string | undefined;
      table: string;
      description: string;
      oldValue: Record<string, unknown> | null;
      newValue: Record<string, unknown> | null;
    },
    transaction: Transaction
  ): Promise<LogEntryAttributes> {
    const keys = union(
      Object.keys(oldValue ?? {}).concat(Object.keys(newValue ?? {}))
    ).filter((key) => oldValue?.[key] !== newValue?.[key]);
    return this.store.create(
      {
        who: who ?? "God",
        table,
        description,
        oldValue: JSON.stringify(pick(oldValue, keys)),
        newValue: JSON.stringify(pick(newValue, keys)),
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
