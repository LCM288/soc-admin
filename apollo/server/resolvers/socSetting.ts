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

const socSettingsResolver: ResolverFn<unknown, SocSettingAttributes[]> = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.socSettingAPI.findSocSettings();
};

const newSocSettingResolver: ResolverFn<
  SocSettingCreationAttributes,
  SocSettingUpdateResponse
> = async (_, arg, { dataSources }) => {
  const socSetting = await dataSources.socSettingAPI.addNewSocSetting(arg);
  if (!socSetting) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", socSetting };
};

/** The resolvers associated with the SocSetting model */
export const resolvers: Resolvers = {
  Query: {
    socSettings: socSettingsResolver,
  },
  Mutation: {
    newSocSetting: newSocSettingResolver,
  },
};

/** The graphql schema associated with the SocSetting model's resolvers */
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
