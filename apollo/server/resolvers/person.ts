import { gql } from "apollo-server";
import { ResolverFn } from "../types/resolver";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
} from "../models/Person";
import { Major } from "../models/Major";

type PersonUpdateResponse = {
  success: boolean;
  message: string;
  person?: PersonAttributes;
};

const majorResolver: ResolverFn<Person, unknown, Major> = (
  { major },
  _,
  { dataSources }
) => {
  return dataSources.majorAPI.getMajor(major);
};

const peopleResolver: ResolverFn<unknown, unknown, PersonAttributes[]> = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.personAPI.findPeople();
};

const newPersonResolver: ResolverFn<
  unknown,
  PersonCreationAttributes,
  PersonUpdateResponse
> = async (_, arg, { dataSources }) => {
  const person = await dataSources.personAPI.addNewPerson(arg);
  if (!person) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", person };
};

export const resolvers = {
  Person: {
    major: majorResolver,
  },
  Query: {
    people: peopleResolver,
  },
  Mutation: {
    newPerson: newPersonResolver,
  },
};

export const typeDefs = gql`
  extend type Query {
    people: [Person!]!
  }

  extend type Mutation {
    newPerson(
      sid: String!
      chineseName: String
      englishName: String!
      gender: Gender
      dateOfBirth: String
      email: String
      phone: String
      college: College!
      major: String!
      dateOfEntry: String!
      expectedGraduationDate: String!
    ): PersonUpdateResponse!
  }

  extend type Person {
    major: Major
  }

  type PersonUpdateResponse {
    success: Boolean!
    message: String
    person: Person
  }
`;
