/**
 * @packageDocumentation
 * @module Faculty
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { Faculty } from "@/models/Faculty";

/** The input arguments for the faculty query's resolver */
interface FacultyResolverArgs {
  code: string;
}

// Query resolvers

/**
 * The resolver for faculties Query
 * @returns All the faculties
 * @category Query Resolver
 */
const facultiesResolver: ResolverFn<unknown, Faculty[]> = (
  _,
  __,
  { dataSources }
): Faculty[] => {
  return dataSources.facultyAPI.getFaculties();
};

/**
 * The resolver for faculty Query
 * @returns The faculty with the given code or null if not found
 * @category Query Resolver
 */
const facultyResolver: ResolverFn<FacultyResolverArgs, Faculty> = (
  _,
  { code },
  { dataSources }
) => {
  return dataSources.facultyAPI.getFaculty(code);
};

/** The resolvers associated with the Faculty model */
export const resolvers: Resolvers = {
  Query: {
    /** see {@link facultiesResolver} */
    faculties: facultiesResolver,
    /** see {@link facultyResolver} */
    faculty: facultyResolver,
  },
};

/**
 * The graphql schema associated with the Faculty model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    faculties: [Faculty!]!
    faculty(code: String): Faculty
  }
`;
