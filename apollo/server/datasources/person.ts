import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
} from "../models/Person";
import { ContextBase } from "../types/datasources";

const transformData = (person: Person): PersonAttributes => {
  return person.get({ plain: true });
};

export default class PersonAPI extends DataSource<ContextBase> {
  private store: typeof Person;

  constructor(person: typeof Person) {
    super();
    this.store = person;
  }

  public async findPeople(): Promise<PersonAttributes[]> {
    const people = await this.store.findAll();
    return people.map(transformData);
  }

  public async addNewPerson(
    arg: PersonCreationAttributes
  ): Promise<PersonAttributes> {
    const person = await this.store.create(arg);
    return transformData(person);
  }
}
