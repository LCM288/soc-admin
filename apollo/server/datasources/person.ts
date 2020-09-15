import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
} from "../models/Person";
import { ContextBase } from "../types/datasources";

export default class PersonAPI extends DataSource<ContextBase> {
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
