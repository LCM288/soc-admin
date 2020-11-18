/**
 * @packageDocumentation
 * @module LogEntry
 */

import { DataSource } from "apollo-datasource";
import { LogEntry, LogEntryAttributes } from "@/models/LogEntry";
import { ContextBase } from "@/types/datasources";
import { Transaction } from "sequelize";
import { union, pick } from "lodash";
import tableData from "@/json/tables.json";
import { DateTime } from "luxon";

/** The response when querying log entries */
export interface LogEntriesResponse {
  /** Total count of log entries */
  count: number;
  /** The log entries for the current filter and page */
  entries: LogEntryAttributes[];
}

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
      oldValue: Record<string, unknown>;
      newValue: Record<string, unknown>;
    },
    transaction: Transaction
  ): Promise<LogEntryAttributes> {
    const keys = [
      (tableData as Record<string, { key: string }>)[table]?.key ?? "id",
    ].concat(
      union(Object.keys(oldValue).concat(Object.keys(newValue))).filter((key) =>
        oldValue[key] instanceof Date && newValue[key] instanceof Date
          ? DateTime.fromJSDate(oldValue[key] as Date).valueOf() !==
            DateTime.fromJSDate(newValue[key] as Date).valueOf()
          : oldValue[key] !== newValue[key]
      )
    );
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
   * Find all log entries
   * @async
   * @returns An array of log entries
   */
  public async findLogEntries(
    limit: number,
    offset: number,
    table: string | undefined
  ): Promise<LogEntriesResponse> {
    const criteria = table ? { table } : {};
    const { count, rows: entries } = await this.store.findAndCountAll({
      where: criteria,
      limit,
      offset,
      order: [["updatedAt", "DESC"]],
      raw: true,
    });
    return { count, entries };
  }
}
