/**
 * @packageDocumentation
 * @module SocSetting
 */
import lodash from "lodash";
import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { NEW_CLIENT_ID_KEY, NEW_CLIENT_SECRET_KEY } from "utils/auth";
import {
  SocSettingAttributes,
  SocSettingCreationAttributes,
} from "@/models/SocSetting";
import publicSocSettings from "utils/socSettings";

const publicSocSettingsArray = lodash.map(publicSocSettings, "key");

const editableKeys = ["client_id", "client_secret"].concat(
  publicSocSettingsArray
);

/** The response when initiating with client keys */
interface ClientKeysUpdateResponse {
  /** Whether the mutation is successful or not */
  success: boolean;
  /** Additional information about the mutation */
  message: string;
}

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

interface ClientKeysAttributes {
  id: string;
  secret: string;
}
// Query resolvers

/**
 * The resolver for socSettings Query
 * @async
 * @returns All the soc settings
 * @category Query Resolver
 */
const socSettingsResolver: ResolverFn<unknown, SocSettingAttributes[]> = async (
  _,
  __,
  { dataSources }
): Promise<SocSettingAttributes[]> => {
  const allSettings = await dataSources.socSettingAPI.findSocSettings();
  if (process.env.NODE_ENV === "development") {
    return allSettings;
  }
  return allSettings.filter((setting) =>
    publicSocSettingsArray.includes(setting.key)
  );
};

/**
 * The resolver for socName Query
 * @async
 * @returns The socName
 * @category Query Resolver
 */
const socNameResolver: ResolverFn<unknown, string> = async (
  _,
  __,
  { dataSources }
): Promise<string> => {
  return (
    (
      await dataSources.socSettingAPI.findSocSetting(
        publicSocSettings.SOC_NAME.key
      )
    )?.value ?? "NoName Soc"
  );
};

// Mutation resolvers

/**
 * The resolver for initClientKeys Mutation
 * @async
 * @param arg - The arguments for the initClientKeys mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const initClientKeysResolver: ResolverFn<
  ClientKeysAttributes,
  ClientKeysUpdateResponse
> = async (
  _,
  { id, secret },
  { user, dataSources }
): Promise<ClientKeysUpdateResponse> => {
  const hasExecutives = Boolean(
    await dataSources.executiveAPI.countExecutives()
  );
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (hasExecutives && !isAdmin) {
    return { success: false, message: "You have no permission to do this" };
  }

  const idResult = await dataSources.socSettingAPI.updateSocSetting({
    key: NEW_CLIENT_ID_KEY,
    value: id,
  });
  const secretResult = await dataSources.socSettingAPI.updateSocSetting({
    key: NEW_CLIENT_SECRET_KEY,
    value: secret,
  });
  if (!idResult || !secretResult) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success" };
};

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
> = async (
  _,
  arg,
  { user, dataSources }
): Promise<SocSettingUpdateResponse> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin || !editableKeys.includes(arg.key)) {
    return { success: false, message: "You have no permission to do this" };
  }
  try {
    const socSetting = await dataSources.socSettingAPI.updateSocSetting(arg);
    return { success: true, message: "success", socSetting };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

/**
 * The resolver for deleteSocSetting Mutation
 * @async
 * @param arg - The arguments for the deleteSocSetting mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const deleteSocSettingResolver: ResolverFn<
  { key: string },
  SocSettingDeleteResponse
> = async (
  _,
  { key },
  { user, dataSources }
): Promise<SocSettingDeleteResponse> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin || !editableKeys.includes(key)) {
    return { success: false, message: "You have no permission to do this" };
  }
  const count = await dataSources.socSettingAPI.deleteSocSetting({ key });
  if (!count) {
    return { success: false, message: `cannot remove setting ${key}` };
  }
  return {
    success: true,
    message: `setting "${key}" removed`,
  };
};

/** The resolvers associated with the SocSetting model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link socSettingsResolver} */
    socSettings: socSettingsResolver,
    /** see {@link socNameResolver} */
    socName: socNameResolver,
  },
  Mutation: {
    /** see {@link initClientKeysResolver} */
    initClientKeys: initClientKeysResolver,
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
    socName: String!
  }

  extend type Mutation {
    initClientKeys(id: String!, secret: String!): ClientKeysUpdateResponse!
    updateSocSetting(key: String!, value: String!): SocSettingUpdateResponse!
    deleteSocSetting(key: String!): SocSettingUpdateResponse!
  }

  type SocSettingUpdateResponse {
    success: Boolean!
    message: String!
    socSetting: SocSetting
  }

  type ClientKeysUpdateResponse {
    success: Boolean!
    message: String!
  }
`;
