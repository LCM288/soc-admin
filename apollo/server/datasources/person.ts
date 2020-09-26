/**
 * @packageDocumentation
 * @module Person
 */

import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonAttributes,
  PersonCreationAttributes,
  PersonUpdateAttributes,
} from "@/models/Person";
import { ContextBase } from "@/types/datasources";
import Sequelize, { Op } from "sequelize";
/**
 * Transforms the data from the Person model to plain attributes
 * @internal
 * @param {Person} person - An instance of the Person model
 * @returns {PersonAttributes} Plain attributes for the Person instance
 */
const transformData = (person: Person): PersonAttributes => {
  return person.get({ plain: true });
};

/**
 * Transforms the data from the Person model to plain attributes
 * @internal
 * @param {Person} person - An instance of the Person model
 * @returns {PersonAttributes} Plain attributes for the Person instance
 */
const transformDataOptional = (
  person: Person | null
): PersonAttributes | undefined => {
  return person?.get({ plain: true });
};

/** An API to retrieve data from the Person store */
export default class PersonAPI extends DataSource<ContextBase> {
  /** The {@link Person} store */
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
   * Find all ***pending*** registrations \
   * A registration maybe for new member or for renewal of membership
   * @async
   * @returns {Promise<PersonAttributes[]>} An array of people
   */
  public async findRegistrations(): Promise<PersonAttributes[]> {
    const registrations = await this.store.findAll({
      where: {
        [Op.or]: [
          { memberSince: { [Op.eq]: null } },
          {
            [Op.and]: [
              Sequelize.where(
                Sequelize.cast(
                  Sequelize.col("memberUntil"),
                  "TIMESTAMP WITH TIME ZONE"
                ),
                Op.lt,
                Sequelize.fn("NOW")
              ),
              Sequelize.where(
                Sequelize.cast(
                  Sequelize.col("memberUntil"),
                  "TIMESTAMP WITH TIME ZONE"
                ),
                Op.lt,
                Sequelize.col("updatedAt")
              ),
            ],
          },
        ],
      },
      raw: true,
    });
    return registrations;
  }

  /**
   * Find a person by sid
   * @param {string} sid - The sid of the person
   * @async
   * @returns {Promise<PersonAttributes>} The matched person or undefined if not found
   */
  public async findPerson(sid: string): Promise<PersonAttributes | undefined> {
    const person = await this.store.findOne({ where: { sid } });
    return transformDataOptional(person);
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

  /**
   * Update a new person
   * @async
   * @param {PersonUpdateAttributes} arg - The arg for the person
   * @returns Number of people updated and instances of updated people
   */
  public async updatePerson(
    arg: PersonUpdateAttributes
  ): Promise<[number, PersonAttributes[]]> {
    const [count, people] = await this.store.update(arg, {
      where: { sid: arg.sid },
      returning: true,
    });
    return [count, [...people].map(transformData)];
  }
}
