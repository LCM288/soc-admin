import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
} from "@/models/Person";
import { ContextBase } from "@/types/datasources";

const transformData = (person: Person): PersonAttributes => {
  return person.get({ plain: true });
};

/** An API to retrieve data from the Person store */
export default class PersonAPI extends DataSource<ContextBase> {
  /** The Person store */
  private store: typeof Person;

  /**
   * Create the API instance.
   * @param {typeof Person} personStore - A Person store.
   */
  constructor(personStore: typeof Person) {
    super();
    this.store = personStore;
  }

  /**
   * Find all people
   * @async
   * @returns {Promise<PersonAttributes[]>} An array of people
   */
  public async findPeople(): Promise<PersonAttributes[]> {
    const people = await this.store.findAll();
    return people.map(transformData);
  }

  /**
   * Add a new person
   * @async
   * @param {PersonCreationAttributes} arg - The arg for the new person
   * @returns {Promise<PersonAttributes>} An instance of the new person
   */
  public async addNewPerson(
    arg: PersonCreationAttributes
  ): Promise<PersonAttributes> {
    const person = await this.store.create(arg);
    return transformData(person);
  }
}
