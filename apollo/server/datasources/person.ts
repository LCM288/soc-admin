/**
 * @packageDocumentation
 * @module Person
 */

import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonAttributes,
  PersonModalAttributes,
  PersonCreationAttributes,
  PersonUpdateAttributes,
} from "@/models/Person";
import { ContextBase } from "@/types/datasources";
import Sequelize, { Op } from "sequelize";
import { DateTime } from "luxon";

export interface ApproveMembershipAttribute {
  sid: string;
  memberUntil: string | null;
}

/** An API to retrieve data from the Person store */
export default class PersonAPI extends DataSource<ContextBase> {
  /** The {@link Person} store */
  private store: typeof Person;

  /** The sequelize connection */
  private sequelize: Sequelize.Sequelize;

  /**
   * Create the API instance.
   * @param {typeof Person} personStore - A Person store.
   * @param {Sequelize.Sequelize} sequelize - The sequelize connection.
   */
  constructor(personStore: typeof Person, sequelize: Sequelize.Sequelize) {
    super();
    this.store = personStore;
    this.sequelize = sequelize;
  }

  /**
   * Find all people
   * @async
   * @returns {Promise<PersonAttributes[]>} An array of people
   */
  public async findPeople(): Promise<PersonAttributes[]> {
    return this.store.findAll({ raw: true });
  }

  /**
   * Find all ***pending*** registrations \
   * A registration maybe for new member or for renewal of membership
   * @async
   * @returns {Promise<PersonAttributes[]>} An array of ***pending*** registrations
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
   * Find all ***active and expired*** members \
   * Including expired members but not those who have never finished registration
   * @async
   * @returns {Promise<PersonAttributes[]>} An array of ***active and expired*** members
   */
  public async findMembers(): Promise<PersonAttributes[]> {
    const members = await this.store.findAll({
      where: {
        memberSince: { [Op.ne]: null },
      },
      raw: true,
    });
    return members;
  }

  /**
   * Find a person by sid
   * @param {string} sid - The sid of the person
   * @async
   * @returns {Promise<PersonAttributes>} The matched person or null if not found
   */
  public async findPerson(sid: string): Promise<PersonAttributes | null> {
    return this.store.findOne({ where: { sid }, raw: true });
  }

  /**
   * Add a new person
   * @async
   * @param {PersonCreationAttributes} arg - The arg for the new person
   * @returns {Promise<PersonAttributes>} An instance of the new person
   */
  public async addNewPerson(
    arg: PersonCreationAttributes
  ): Promise<PersonModalAttributes> {
    return (await this.store.create(arg)).get({ plain: true });
  }

  /**
   * Update a person
   * @async
   * @param arg - The arg for updating the person
   * @returns The updated people
   */
  public async updatePerson(
    arg: PersonUpdateAttributes
  ): Promise<PersonModalAttributes> {
    const [count, people] = await this.store.update(arg, {
      where: { sid: arg.sid },
      returning: true,
    });
    if (!count) {
      throw new Error(`Cannot update person record for sid ${arg.sid}`);
    }
    return people[0].get({ plain: true });
  }

  /**
   * Approve someone's membership
   * @async
   * @param {ApproveMembershipAttribute} arg - The arg for the approval
   * @returns The updated person
   */
  public async approveMembership({
    sid,
    memberUntil,
  }: ApproveMembershipAttribute): Promise<PersonAttributes> {
    const result = await this.sequelize.transaction(async (t) => {
      const person = await this.store.findOne({
        where: {
          [Op.and]: {
            sid,
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
        },
        transaction: t,
      });
      if (!person) {
        throw new Error(`Cannot find registration record for sid ${sid}`);
      }
      person
        .set("memberUntil", memberUntil)
        .set("memberSince", DateTime.local().toISO())
        .save({ transaction: t });
      return this.store.findOne({
        where: { sid },
        transaction: t,
        raw: true,
      });
    });
    if (!result) {
      throw new Error(`Cannot update record for sid ${sid}`);
    }
    return result;
  }
}
