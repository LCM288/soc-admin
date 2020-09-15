import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "../types/resolver";
import {
  ExecutiveAttributes,
  ExecutiveCreationAttributes,
} from "../models/Executive";

type ExecutiveUpdateResponse = {
  success: boolean;
  message: string;
  executive?: ExecutiveAttributes;
};

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

export const resolvers: Resolvers = {
  Query: {
    executives: executivesResolver,
  },
  Mutation: {
    newExecutive: newExecutiveResolver,
  },
};

export const typeDefs = gql`
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
