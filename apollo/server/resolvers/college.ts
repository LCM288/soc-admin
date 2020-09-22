/**
 * @packageDocumentation
 * @module College
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { College } from "@/models/College";
import { CollegeEnum } from "@/models/Person";

/** The input arguments for the college query's resolver */
interface CollegeResolverArgs {
  code: CollegeEnum;
}

// Query resolvers

/**
 * The resolver for colleges Query
 * @returns All the colleges
 * @category Query Resolver
 */
const collegesResolver: ResolverFn<unknown, College[]> = (
  _,
  __,
  { dataSources }
): College[] => {
  return dataSources.collegeAPI.getColleges();
};

/**
 * The resolver for college Query
 * @returns The college with the given code or undefined if not found
 * @category Query Resolver
 */
const collegeResolver: ResolverFn<CollegeResolverArgs, College | undefined> = (
  _,
  { code },
  { dataSources }
): College | undefined => {
  return dataSources.collegeAPI.getCollege(code);
};

/** The resolvers associated with the College model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link collegesResolver} */
    colleges: collegesResolver,
    /** see {@link collegeResolver} */
    college: collegeResolver,
  },
};

/**
 * The graphql schema associated with the Faculty model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    colleges: [College!]!
    college(code: String): College
  }
`;
