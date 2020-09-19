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

// Field resolvers

/**
 * The resolver for the major field of a Person
 * @returns The major of the Person
 * @category Field Resolver
 */
const majorResolver: ResolverFn<unknown, Major> = (
  { major }: Person,
  _,
  { dataSources }
): Major => {
  return dataSources.majorAPI.getMajor(major);
};

// Query resolvers

/**
 * The resolver for people Query
 * @async
 * @returns All the people
 * @category Query Resolver
 */
const peopleResolver: ResolverFn<unknown, PersonAttributes[]> = (
  _,
  __,
  { dataSources }
): Promise<PersonAttributes[]> => {
  return dataSources.personAPI.findPeople();
};

// Mutation resolvers

/**
 * The resolver for newPerson Mutation
 * @async
 * @param arg - The arguments for the newPerson mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const newPersonResolver: ResolverFn<
  PersonCreationAttributes,
  PersonUpdateResponse
> = async (_, arg, { dataSources }): Promise<PersonUpdateResponse> => {
  const person = await dataSources.personAPI.addNewPerson(arg);
  if (!person) {
    return { success: false, message: "Something wrong happened" };
  }
  return { success: true, message: "success", person };
};

/** The resolvers associated with the Person model */
export const resolvers: Resolvers = {
  Person: {
    /** see {@link majorResolver} */
    major: majorResolver,
  },
  Query: {
    /** see {@link peopleResolver} */
    people: peopleResolver,
  },
  Mutation: {
    /** see {@link newPersonResolver} */
    newPerson: newPersonResolver,
  },
};

/**
 * The graphql schema associated with the Person model's resolvers
 * @internal
 */
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
