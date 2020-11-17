/**
 * @packageDocumentation
 * @module LogEntry
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { LogEntriesResponse } from "@/datasources/logEntry";

/** The input arguments for the logEntries query's resolver */
interface LogEntriesResolverArgs {
  limit: number;
  offset: number;
  table?: string;
}

// Query resolvers

/**
 * The resolver for logEntries Query
 * @returns All the log entries
 * @category Query Resolver
 */
const logEntriesResolver: ResolverFn<
  LogEntriesResolverArgs,
  LogEntriesResponse
> = async (
  _,
  { limit, offset, table }: LogEntriesResolverArgs,
  { user, dataSources }
): Promise<LogEntriesResponse> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    throw new Error("You have no permission to do this");
  }
  return dataSources.logEntryAPI.findLogEntries(limit, offset, table);
};

/** The resolvers associated with the LogEntry model */
export const resolvers: Resolvers = {
  Query: {
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
    logEntries(limit: Int!, offset: Int!, table: String): LogEntriesResponse!
  }

  type LogEntriesResponse {
    count: Int!
    entries: [LogEntry!]!
  }
`;
