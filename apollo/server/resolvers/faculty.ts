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

const facultiesResolver: ResolverFn<unknown, Faculty[]> = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.facultyAPI.getFaculties();
};

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
    faculties: facultiesResolver,
    faculty: facultyResolver,
  },
};

/** The graphql schema associated with the Faculty model's resolvers */
export const resolverTypeDefs = gql`
  extend type Query {
    faculties: [Faculty!]!
    faculty(code: String): Faculty
  }
`;
