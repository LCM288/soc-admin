import { gql } from "apollo-server";
import { ResolverFn } from "../types/resolver";
import { Major } from "../models/Major";
import { Faculty } from "../models/Faculty";

interface MajorResolverArgs {
  code: string;
}

const facultiesResolver: ResolverFn<Major, unknown, Faculty[]> = (
  { faculties },
  _,
  { dataSources }
) => {
  return faculties.map((faculty) => dataSources.facultyAPI.getFaculty(faculty));
};

const majorsResolver: ResolverFn<unknown, unknown, Major[]> = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.majorAPI.getMajors();
};

const majorResolver: ResolverFn<unknown, MajorResolverArgs, Major> = (
  _,
  { code },
  { dataSources }
) => {
  return dataSources.majorAPI.getMajor(code);
};

export const resolvers = {
  Major: {
    faculties: facultiesResolver,
  },
  Query: {
    majors: majorsResolver,
    major: majorResolver,
  },
};

export const typeDefs = gql`
  extend type Query {
    majors: [Major!]!
    major(code: String): Major
  }
`;
