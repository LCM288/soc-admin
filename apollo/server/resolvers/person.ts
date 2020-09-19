/**
 * @packageDocumentation
 * @module Person
 */

import { gql } from "apollo-server";
import { ResolverFn, Resolvers } from "@/types/resolver";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
} from "@/models/Person";
import { Major } from "@/models/Major";

/** The response when mutating a single person */
interface PersonUpdateResponse {
  /** Whether the mutation is successful or not */
  success: boolean;
  /** Additional information about the mutation */
  message: string;
  /** The new person's attributes */
  person?: PersonAttributes;
}

const majorResolver: ResolverFn<unknown, Major> = (
  { major }: Person,
  _,
  { dataSources }
) => {
  return dataSources.majorAPI.getMajor(major);
};

const peopleResolver: ResolverFn<unknown, PersonAttributes[]> = (
  _,
  __,
  { dataSources }
) => {
  return dataSources.personAPI.findPeople();
};

const newPersonResolver: ResolverFn<
  PersonCreationAttributes,
  PersonUpdateResponse
> = async (_, arg, { dataSources }) => {
  const person = await dataSources.personAPI.addNewPerson(arg);
  if (!person) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", person };
};

/** The resolvers associated with the Executive model */
export const resolvers: Resolvers = {
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

/** The graphql schema associated with the Executive model's resolvers */
export const resolverTypeDefs = gql`
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
    message: String!
    person: Person
  }
`;
