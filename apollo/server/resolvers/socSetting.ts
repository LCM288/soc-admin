/**
 * @packageDocumentation
 * @module SocSetting
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import {
  SocSettingAttributes,
  SocSettingCreationAttributes,
} from "@/models/SocSetting";

/** The response when mutating a single socSetting */
interface SocSettingUpdateResponse {
  /** Whether the mutation is successful or not */
  success: boolean;
  /** Additional information about the mutation */
  message: string;
  /** The new soc setting's attributes */
  socSetting?: SocSettingAttributes;
}

// Query resolvers

/**
 * The resolver for socSettings Query
 * @async
 * @returns All the soc settings
 * @category Query Resolver
 */
const socSettingsResolver: ResolverFn<unknown, SocSettingAttributes[]> = (
  _,
  __,
  { dataSources }
): Promise<SocSettingAttributes[]> => {
  return dataSources.socSettingAPI.findSocSettings();
};

// Mutation resolvers

/**
 * The resolver for newSocSetting Mutation
 * @async
 * @param arg - The arguments for the newSocSetting mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const newSocSettingResolver: ResolverFn<
  SocSettingCreationAttributes,
  SocSettingUpdateResponse
> = async (_, arg, { dataSources }): Promise<SocSettingUpdateResponse> => {
  const socSetting = await dataSources.socSettingAPI.addNewSocSetting(arg);
  if (!socSetting) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", socSetting };
};

/** The resolvers associated with the SocSetting model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link socSettingsResolver} */
    socSettings: socSettingsResolver,
  },
  Mutation: {
    /** see {@link newSocSettingResolver} */
    newSocSetting: newSocSettingResolver,
  },
};

/**
 * The graphql schema associated with the SocSetting model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    socSettings: [SocSetting!]!
  }

  extend type Mutation {
    newSocSetting(key: String!, value: String!): SocSettingUpdateResponse!
  }

  type SocSettingUpdateResponse {
    success: Boolean!
    message: String!
    socSetting: SocSetting
  }
`;
