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

/** The response when deleting socSetting(s) */
interface SocSettingDeleteResponse {
  /** Whether the mutation is successful or not */
  success: boolean;
  /** Additional information about the mutation */
  message: string;
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
 * The resolver for updateSocSetting Mutation
 * @async
 * @param arg - The arguments for the updateSocSetting mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const updateSocSettingResolver: ResolverFn<
  SocSettingCreationAttributes,
  SocSettingUpdateResponse
> = async (_, arg, { dataSources }): Promise<SocSettingUpdateResponse> => {
  const socSetting = await dataSources.socSettingAPI.updateSocSetting(arg);
  if (!socSetting) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", socSetting };
};

/**
 * The resolver for deleteSocSetting Mutation
 * @async
 * @param arg - The arguments for the deleteSocSetting mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const deleteSocSettingResolver: ResolverFn<
  SocSettingCreationAttributes,
  SocSettingDeleteResponse
> = async (_, arg, { dataSources }): Promise<SocSettingDeleteResponse> => {
  const count = await dataSources.socSettingAPI.deleteSocSetting(arg);
  if (!Number.isInteger(count)) {
    return { success: false, message: "Something wrong happened" };
  }
  return {
    success: true,
    message: `${count} setting${(count !== 1 && "s") || ""} removed`,
  };
};

/** The resolvers associated with the SocSetting model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link socSettingsResolver} */
    socSettings: socSettingsResolver,
  },
  Mutation: {
    /** see {@link updateSocSettingResolver} */
    updateSocSetting: updateSocSettingResolver,
    /** see {@link deleteSocSettingResolver} */
    deleteSocSetting: deleteSocSettingResolver,
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
    updateSocSetting(key: String!, value: String!): SocSettingUpdateResponse!
    deleteSocSetting(key: String!): SocSettingUpdateResponse!
  }

  type SocSettingUpdateResponse {
    success: Boolean!
    message: String!
    socSetting: SocSetting
  }
`;
