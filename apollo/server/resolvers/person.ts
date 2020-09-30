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
import { ApproveMembershipAttribute } from "@/datasources/person";
import { omit } from "lodash";

/** The input arguments for the person query's resolver */
interface PersonResolverArgs {
  sid: string;
}
/** The input arguments for the approveMembership mutation's resolver */
type ApproveMembershipResolverArgs = ApproveMembershipAttribute;

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
const peopleResolver: ResolverFn<unknown, PersonAttributes[]> = async (
  _,
  __,
  { user, dataSources }
): Promise<PersonAttributes[]> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    throw new Error("You have no permission to read this");
  }
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
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    throw new Error("You have no permission to read this");
  }
  return dataSources.personAPI.findRegistrations();
};

/**
 * The resolver for members Query
 * @async
 * @returns All the active members (as PersonAttributes[])
 * @category Query Resolver
 */
const membersResolver: ResolverFn<unknown, PersonAttributes[]> = async (
  _,
  __,
  { user, dataSources }
): Promise<PersonAttributes[]> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    throw new Error("You have no permission to read this");
  }
  return dataSources.personAPI.findMembers();
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
> = async (
  _,
  { sid },
  { user, dataSources }
): Promise<PersonAttributes | undefined> => {
  if (user?.sid === sid) {
    return dataSources.personAPI.findPerson(sid);
  }
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    throw new Error("You have no permission to read this");
  }
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
> = async (_, arg, { user, dataSources }): Promise<PersonUpdateResponse> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin && user?.sid !== arg.sid) {
    return { success: false, message: "You have no permission to do this" };
  }
  const person = await dataSources.personAPI.addNewPerson({
    ...arg,
    memberSince: null,
    memberUntil: null,
  });
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
> = async (_, arg, { user, dataSources }): Promise<PersonUpdateResponse> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin && user?.sid !== arg.sid) {
    return { success: false, message: "You have no permission to do this" };
  }
  const [count, [person]] = await dataSources.personAPI.updatePerson(
    omit(arg, isAdmin ? ["memberSince"] : ["memberSince", "memberUntil"])
  );
  if (!Number.isInteger(count)) {
    return { success: false, message: "Something wrong happened" };
  }
  return {
    success: true,
    message: `${count} ${count !== 1 ? "people" : "person"} updated`,
    person,
  };
};

/**
 * The resolver for approveMembership Mutation
 * @async
 * @param arg - The arguments for the approveMembership mutation
 * @returns The update response
 * @category Mutation Resolver
 */
const approveMembershipResolver: ResolverFn<
  ApproveMembershipResolverArgs,
  PersonUpdateResponse
> = async (_, arg, { user, dataSources }): Promise<PersonUpdateResponse> => {
  const isAdmin = Boolean(
    user && (await dataSources.executiveAPI.findExecutive(user.sid))
  );
  if (!isAdmin) {
    return {
      success: false,
      message: "Please log in as executive",
    };
  }
  const result = await dataSources.personAPI.approveMembership(arg);
  if (typeof result === "string") {
    return {
      success: false,
      message: result,
    };
  }
  return {
    success: true,
    message: `Hooray!🎉 ${result.englishName} is now a member of us`,
    person: result,
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
    /** see {@link membersResolver} */
    members: membersResolver,
    /** see {@link personResolver} */
    person: personResolver,
  },
  Mutation: {
    /** see {@link newPersonResolver} */
    newPerson: newPersonResolver,
    /** see {@link updatePersonResolver} */
    updatePerson: updatePersonResolver,
    /** see {@link approveMembershipResolver} */
    approveMembership: approveMembershipResolver,
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
    members: [Person!]!
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

    approveMembership(sid: String!, memberUntil: Date): PersonUpdateResponse!
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
