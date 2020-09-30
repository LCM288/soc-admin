/**
 * @packageDocumentation
 * @module Executive
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import {
  ExecutiveAttributes,
  ExecutiveCreationAttributes,
  ExecutiveUpdateAttributes,
} from "@/models/Executive";

/** The response when mutating a single executive */
interface ExecutiveUpdateResponse {
  /** Whether the mutation is successful or not */
  success: boolean;
  /** Additional information about the mutation */
  message: string;
  /** The new executive's attributes */
  executive?: ExecutiveAttributes;
}

/** The input arguments for the faculty query's resolver */
interface ExecutiveResolverArgs {
  sid: string;
}
// Query resolvers

/**
 * The resolver for executives Query
 * @async
 * @returns All the executives
 * @category Query Resolver
 */
const executivesResolver: ResolverFn<null, ExecutiveAttributes[]> = async (
  _,
  __,
  { user, dataSources }
): Promise<ExecutiveAttributes[]> => {
  const executives = await dataSources.executiveAPI.findExecutives();
  if (executives.map((executive) => executive.sid).includes(user?.sid ?? "")) {
    return executives;
  }
  throw new Error("You have no permission to read this");
};

/**
 * The resolver for executive Query
 * @async
 * @returns The executive matches the sid or undefined if not found
 * @category Query Resolver
 */
const executiveResolver: ResolverFn<
  ExecutiveResolverArgs,
  ExecutiveAttributes | undefined
> = async (
  _,
  { sid },
  { user, dataSources }
): Promise<ExecutiveAttributes | undefined> => {
  if (user?.sid === sid) {
    return dataSources.executiveAPI.findExecutive(sid);
  }
  const isAdmin = Boolean(
    await dataSources.executiveAPI.findExecutive(user?.sid ?? "")
  );
  if (!isAdmin) {
    throw new Error("You have no permission to read this");
  }
  return dataSources.executiveAPI.findExecutive(sid);
};

// Mutation resolvers

/**
 * The resolver for newExecutive Mutation
 * @async
 * @param arg - The arguments for the newExecutive mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const newExecutiveResolver: ResolverFn<
  ExecutiveCreationAttributes,
  ExecutiveUpdateResponse
> = async (_, arg, { user, dataSources }): Promise<ExecutiveUpdateResponse> => {
  const isAdmin = Boolean(
    await dataSources.executiveAPI.findExecutive(user?.sid ?? "")
  );
  // TODO: count admin, allow new executive if executives count is 0
  if (!isAdmin) {
    return { success: false, message: "You have no permission to do this" };
  }
  const executive = await dataSources.executiveAPI.addNewExecutive(arg);
  if (!executive) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", executive };
};

/**
 * The resolver for updateExecutive Mutation
 * @async
 * @param arg - The arguments for the updateExecutive mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const updateExecutiveResolver: ResolverFn<
  ExecutiveUpdateAttributes,
  ExecutiveUpdateResponse
> = async (_, arg, { user, dataSources }): Promise<ExecutiveUpdateResponse> => {
  const isAdmin = Boolean(
    await dataSources.executiveAPI.findExecutive(user?.sid ?? "")
  );
  if (!isAdmin) {
    return { success: false, message: "You have no permission to do this" };
  }
  const [count, [executive]] = await dataSources.executiveAPI.updateExecutive(
    arg
  );
  if (!Number.isInteger(count)) {
    return { success: false, message: "Something wrong happened" };
  }
  return {
    success: true,
    message: `${count} executive${count !== 1 ? "s" : ""} updated`,
    executive,
  };
};

/** The resolvers associated with the Executive model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link executivesResolver} */
    executives: executivesResolver,
    /** see {@link executiveResolver} */
    executive: executiveResolver,
  },
  Mutation: {
    /** see {@link newExecutiveResolver} */
    newExecutive: newExecutiveResolver,
    /** see {@link updateExecutiveResolver} */
    updateExecutive: updateExecutiveResolver,
  },
};

/**
 * The graphql schema associated with the Executive model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    executives: [Executive!]!
    executive(sid: String): Executive
  }

  extend type Mutation {
    newExecutive(
      sid: String!
      nickname: String
      pos: String
    ): ExecutiveUpdateResponse!
    updateExecutive(
      sid: String!
      nickname: String
      pos: String
    ): ExecutiveUpdateResponse!
  }

  type ExecutiveUpdateResponse {
    success: Boolean!
    message: String!
    executive: Executive
  }
`;
