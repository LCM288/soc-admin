/**
 * @packageDocumentation
 * @module LogEntry
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { LogEntryAttributes } from "@/models/LogEntry";

// Query resolvers

/**
 * The resolver for countLogEntries Query
 * @async
 * @returns Number of log entries
 * @category Query Resolver
 */
const countLogEntriesResolver: ResolverFn<null, number> = async (
  _,
  __,
  { user, dataSources }
): Promise<number> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    throw new Error("You have no permission to do this");
  }
  return dataSources.logEntryAPI.countLogEntries();
};

/**
 * The resolver for logEntries Query
 * @returns All the log entries
 * @category Query Resolver
 */
const logEntriesResolver: ResolverFn<unknown, LogEntryAttributes[]> = async (
  _,
  __,
  { user, dataSources }
): Promise<LogEntryAttributes[]> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    throw new Error("You have no permission to do this");
  }
  return dataSources.logEntryAPI.findLogEntries();
};

/** The resolvers associated with the LogEntry model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link countLogEntriesResolver} */
    countLogEntries: countLogEntriesResolver,
    /** see {@link logEntriesResolver} */
    logEntries: logEntriesResolver,
  },
};

/**
 * The graphql schema associated with the LogEntry model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    countLogEntries: Int!
    logEntries: [LogEntry!]!
  }
`;
