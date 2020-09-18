import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import { Faculty } from "@/models/Faculty";

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

export const resolvers: Resolvers = {
  Query: {
    faculties: facultiesResolver,
    faculty: facultyResolver,
  },
};

export const typeDefs = gql`
  extend type Query {
    faculties: [Faculty!]!
    faculty(code: String): Faculty
  }
`;
