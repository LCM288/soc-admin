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
  if (user && executives.map((executive) => executive.sid).includes(user.sid)) {
    return executives;
  }
  throw new Error("You have no permission to read this");
};

/**
 * The resolver for executive Query
 * @async
 * @returns The executive matches the sid or null if not found
 * @category Query Resolver
 */
const executiveResolver: ResolverFn<
  ExecutiveResolverArgs,
  ExecutiveAttributes | null
> = async (
  _,
  { sid },
  { user, dataSources }
): Promise<ExecutiveAttributes | null> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin && sid !== user?.sid) {
    throw new Error("You have no permission to read this");
  }
  return dataSources.executiveAPI.findExecutive(sid);
};

/**
 * The resolver for countExecutives Query
 * @async
 * @returns Number of executives
 * @category Query Resolver
 */
const countExecutivesResolver: ResolverFn<null, number> = (
  _,
  __,
  { dataSources }
): Promise<number> => {
  return dataSources.executiveAPI.countExecutives();
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
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  const hasExecutives = Boolean(
    await dataSources.executiveAPI.countExecutives()
  );
  if (!isAdmin && hasExecutives) {
    return { success: false, message: "You have no permission to do this" };
  }
  try {
    const executive = await dataSources.executiveAPI.addNewExecutive(arg);
    return { success: true, message: "success", executive };
  } catch (err) {
    return { success: false, message: err.message };
  }
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
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    return { success: false, message: "You have no permission to do this" };
  }
  try {
    const executive = await dataSources.executiveAPI.updateExecutive(arg);
    return {
      success: true,
      message: `success`,
      executive,
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/** The resolvers associated with the Executive model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link executivesResolver} */
    executives: executivesResolver,
    /** see {@link executiveResolver} */
    executive: executiveResolver,
    /** see {@link countExecutivesResolver} */
    countExecutives: countExecutivesResolver,
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
    countExecutives: Int!
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
