/**
 * @packageDocumentation
 * @module Major
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { Major } from "@/models/Major";
import { Faculty } from "@/models/Faculty";

/** The input arguments for the major query's resolver */
interface MajorResolverArgs {
  code: string;
}

const facultiesResolver: ResolverFn<unknown, Faculty[]> = (
  { faculties }: Major,
  _,
  { dataSources }
) => {
  return faculties.map((faculty) => dataSources.facultyAPI.getFaculty(faculty));
};

const majorsResolver: ResolverFn<unknown, Major[]> = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.majorAPI.getMajors();
};

const majorResolver: ResolverFn<MajorResolverArgs, Major> = (
  _,
  { code },
  { dataSources }
) => {
  return dataSources.majorAPI.getMajor(code);
};

/** The resolvers associated with the Major model */
export const resolvers: Resolvers = {
  Major: {
    faculties: facultiesResolver,
  },
  Query: {
    majors: majorsResolver,
    major: majorResolver,
  },
};

/** The graphql schema associated with the Major model's resolvers */
export const resolverTypeDefs = gql`
  extend type Query {
    majors: [Major!]!
    major(code: String): Major
  }
`;
