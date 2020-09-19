/**
 * @packageDocumentation
 * @module Executive
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import {
  ExecutiveAttributes,
  ExecutiveCreationAttributes,
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
const executivesResolver: ResolverFn<null, ExecutiveAttributes[]> = (
  _,
  __,
  { dataSources }
): Promise<ExecutiveAttributes[]> => {
  return dataSources.executiveAPI.findExecutives();
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
> = (_, { sid }, { dataSources }): Promise<ExecutiveAttributes | undefined> => {
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
> = async (_, arg, { dataSources }): Promise<ExecutiveUpdateResponse> => {
  const executive = await dataSources.executiveAPI.addNewExecutive(arg);
  if (!executive) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", executive };
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
  }

  type ExecutiveUpdateResponse {
    success: Boolean!
    message: String!
    executive: Executive
  }
`;
