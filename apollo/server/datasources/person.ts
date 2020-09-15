import { gql } from "apollo-server";
import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
} from "../../../models/Person";
import { MajorAPI, Major } from "./major";
import { Context } from "../type";

export class PersonAPI extends DataSource<Context> {
  private store: typeof Person;

  constructor(person: typeof Person) {
    super();
    this.store = person;
  }

  private static transformData(person: Person): PersonAttributes {
    return person.get({ plain: true });
  }

  async findPeople(): Promise<PersonAttributes[]> {
    const people = await this.store.findAll();
    return people.map(PersonAPI.transformData);
  }

  async addNewPerson(arg: PersonCreationAttributes): Promise<PersonAttributes> {
    const person = await this.store.create(arg);
    return PersonAPI.transformData(person);
  }
}

interface PersonAPIDatasource {
  personAPI: PersonAPI;
  majorAPI: MajorAPI;
}

interface PersonAPIContext extends Context {
  dataSources: PersonAPIDatasource;
}

type ResolverFn<Parent, Args, Result> = (
  parent: Parent,
  args: Args,
  context: PersonAPIContext
) => Result | Promise<Result>;

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
