import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import {
  SocSettingAttributes,
  SocSettingCreationAttributes,
} from "@/models/SocSetting";

type SocSettingUpdateResponse = {
  success: boolean;
  message: string;
  socSetting?: SocSettingAttributes;
};

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

export const resolvers: Resolvers = {
  Query: {
    socSettings: socSettingsResolver,
  },
  Mutation: {
    newSocSetting: newSocSettingResolver,
  },
};

export const typeDefs = gql`
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
