import { gql } from "apollo-server";
import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
} from "../../../models/Person";

export class PersonAPI extends DataSource {
  private Person: typeof Person;

  constructor(person: typeof Person) {
    super();
    this.Person = person;
  }

  private static transformData(person: Person): PersonAttributes {
    return person.get({ plain: true });
  }

  async findPeople(): Promise<PersonAttributes[]> {
    const people = await this.Person.findAll();
    return people.map(PersonAPI.transformData);
  }

  async addNewPerson(arg: PersonCreationAttributes): Promise<PersonAttributes> {
    const person = await this.Person.create(arg);
    return PersonAPI.transformData(person);
  }
}

interface PersonAPIDatasource {
  personAPI: PersonAPI;
}

interface PersonAPIContext {
  dataSources: PersonAPIDatasource;
}

export const resolvers = {
  Person: {
    major: ({ major }, _, { dataSources }) => {
      return dataSources.majorAPI.getMajor(major);
    },
  },
  Query: {
    people: (_, __, { dataSources }: PersonAPIContext) => {
      return dataSources.personAPI.findPeople();
    },
  },
  Mutation: {
    newPerson: async (
      _,
      arg: PersonCreationAttributes,
      { dataSources }: PersonAPIContext
    ) => {
      const person = await dataSources.personAPI.addNewPerson(arg);
      if (!person) {
        return { success: false, message: "Something wrong happened" };
      }
      return { success: true, message: "success", person };
    },
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
