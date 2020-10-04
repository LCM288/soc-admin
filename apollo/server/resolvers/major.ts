/**
 * @packageDocumentation
 * @module Major
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { Major } from "@/models/Major";
import { Faculty } from "@/models/Faculty";
import { compact } from "lodash";

/** The input arguments for the major query's resolver */
interface MajorResolverArgs {
  code: string;
}

// Field resolvers

/**
 * The resolver for the faculty field of a Major
 * @returns The faculties that the Major belongs to
 * @category Field Resolver
 */
const facultiesResolver: ResolverFn<unknown, Faculty[]> = (
  { faculties }: Major,
  _,
  { dataSources }
): Faculty[] => {
  return compact(
    (faculties as string[]).map((faculty) =>
      dataSources.facultyAPI.getFaculty(faculty)
    )
  );
};

// Query resolvers

/**
 * The resolver for majors Query
 * @returns All the majors
 * @category Query Resolver
 */
const majorsResolver: ResolverFn<unknown, Major[]> = (
  _,
  __,
  { dataSources }
): Major[] => {
  return dataSources.majorAPI.getMajors();
};

/**
 * The resolver for major Query
 * @returns The major with the given code or undefined if not found
 * @category Query Resolver
 */
const majorResolver: ResolverFn<MajorResolverArgs, Major | undefined> = (
  _,
  { code },
  { dataSources }
): Major | undefined => {
  return dataSources.majorAPI.getMajor(code);
};

/** The resolvers associated with the Major model */
export const resolvers: Resolvers = {
  Major: {
    /** see {@link facultiesResolver} */
    faculties: facultiesResolver,
  },
  Query: {
    /** see {@link majorsResolver} */
    majors: majorsResolver,
    /** see {@link majorResolver} */
    major: majorResolver,
  },
};

/**
 * The graphql schema associated with the Major model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    majors: [Major!]!
    major(code: String): Major
  }
`;
