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

const executivesResolver: ResolverFn<unknown, ExecutiveAttributes[]> = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.executiveAPI.findExecutives();
};

const newExecutiveResolver: ResolverFn<
  ExecutiveCreationAttributes,
  ExecutiveUpdateResponse
> = async (_, arg, { dataSources }) => {
  const executive = await dataSources.executiveAPI.addNewExecutive(arg);
  if (!executive) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", executive };
};

/** The resolvers associated with the Executive model */
export const resolvers: Resolvers = {
  Query: {
    executives: executivesResolver,
  },
  Mutation: {
    newExecutive: newExecutiveResolver,
  },
};

/** The graphql schema associated with the Executive model's resolvers */
export const resolverTypeDefs = gql`
  extend type Query {
    executives: [Executive!]!
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
