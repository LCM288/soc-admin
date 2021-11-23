/**
 * @packageDocumentation
 * @module Auth
 */
import { gql } from "apollo-server";
import { JWT_PUBLIC_KEY, issueJwt } from "utils/auth";
import { ResolverFn, Resolvers } from "@/types/resolver";

// Query resolvers

/**
 * The resolver for publicKey Query
 * @async
 * @returns The jwt public key
 * @category Query Resolver
 */
const publicKeyResolver: ResolverFn<unknown, string | undefined> = async (
  _,
  __,
  { dataSources }
): Promise<string | undefined> => {
  return (await dataSources.socSettingAPI.findSocSetting(JWT_PUBLIC_KEY))
    ?.value;
};

// Mutation resolvers
/**
 * The resolver for refresh jwt Mutation
 * @async
 * @returns The refreshed jwt
 * @category Mutation Resolver
 */
const refreshJWTResolver: ResolverFn<unknown, string | undefined> = async (
  _,
  __,
  { user }
): Promise<string | undefined> => {
  if (!user) {
    return undefined;
  }
  return issueJwt(user);
};

/** The resolvers associated with the SocSetting model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link publicKeyResolver} */
    publicKey: publicKeyResolver,
  },
  Mutation: {
    /** see {@link refreshJWTResolver} */
    refreshJWT: refreshJWTResolver,
  },
};

/**
 * The graphql schema associated with the SocSetting model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    publicKey: String
  }

  extend type Mutation {
    refreshJWT: String
  }
`;
