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
  CollegeEnum,
} from "@/models/Person";
import { Major } from "@/models/Major";
import { College } from "@/models/College";

/** The input arguments for the person query's resolver */
interface PersonResolverArgs {
  sid: string;
}

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
const majorResolver: ResolverFn<null, Major | undefined> = (
  { major }: Person,
  _,
  { dataSources }
): Major | undefined => {
  return dataSources.majorAPI.getMajor(major as string);
};

/**
 * The resolver for the college field of a Person
 * @returns The college of the Person
 * @category Field Resolver
 */
const collegeResolver: ResolverFn<null, College> = (
  { college }: Person,
  _,
  { dataSources }
): College => {
  return dataSources.collegeAPI.getCollege(college as CollegeEnum);
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

/**
 * The resolver for registrations Query
 * @async
 * @returns All the registrations (as PersonAttributes[])
 * @category Query Resolver
 */
const registrationsResolver: ResolverFn<unknown, PersonAttributes[]> = async (
  _,
  __,
  { user, dataSources }
): Promise<PersonAttributes[]> => {
  const isAdmin = Boolean(
    await dataSources.executiveAPI.findExecutive(user?.sid ?? "")
  );
  // only admin can access
  if (isAdmin) {
    return dataSources.personAPI.findRegistrations();
  }
  return [];
};

/**
 * The resolver for person Query
 * @async
 * @returns The person with the given sid or undefined if not found
 * @category Query Resolver
 */
const personResolver: ResolverFn<
  PersonResolverArgs,
  PersonAttributes | undefined
> = (_, { sid }, { dataSources }): Promise<PersonAttributes | undefined> => {
  return dataSources.personAPI.findPerson(sid);
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

/**
 * The resolver for updatePerson Mutation
 * @async
 * @param arg - The arguments for the updatePerson mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const updatePersonResolver: ResolverFn<
  PersonAttributes,
  PersonUpdateResponse
> = async (_, arg, { dataSources }): Promise<PersonUpdateResponse> => {
  const [count, [person]] = await dataSources.personAPI.updatePerson(arg);
  if (!Number.isInteger(count)) {
    return { success: false, message: "Something wrong happened" };
  }
  return {
    success: true,
    message: `${count} ${count !== 1 ? "people" : "person"} updated`,
    person,
  };
};

/** The resolvers associated with the Person model */
export const resolvers: Resolvers = {
  Person: {
    /** see {@link majorResolver} */
    major: majorResolver,
    /** see {@link collegeResolver} */
    college: collegeResolver,
  },
  Query: {
    /** see {@link peopleResolver} */
    people: peopleResolver,
    /** see {@link registrationsResolver} */
    registrations: registrationsResolver,
    /** see {@link personResolver} */
    person: personResolver,
  },
  Mutation: {
    /** see {@link newPersonResolver} */
    newPerson: newPersonResolver,
    /** see {@link updatePersonResolver} */
    updatePerson: updatePersonResolver,
  },
};

/**
 * The graphql schema associated with the Person model's resolvers
 * @internal
 */
export const resolverTypeDefs = gql`
  extend type Query {
    people: [Person!]!
    registrations: [Person!]!
    person(sid: String!): Person
  }

  extend type Mutation {
    newPerson(
      sid: String!
      chineseName: String
      englishName: String!
      gender: Gender_ENUM
      dateOfBirth: Date
      email: String
      phone: String
      college: College_ENUM!
      major: String!
      dateOfEntry: Date!
      expectedGraduationDate: Date!
    ): PersonUpdateResponse!
    updatePerson(
      sid: String!
      chineseName: String
      englishName: String
      gender: Gender_ENUM
      dateOfBirth: Date
      email: String
      phone: String
      college: College_ENUM
      major: String
      dateOfEntry: Date
      expectedGraduationDate: Date
    ): PersonUpdateResponse!
  }

  extend type Person {
    major: Major
    college: College
  }

  type PersonUpdateResponse {
    success: Boolean!
    message: String!
    person: Person
  }
`;
