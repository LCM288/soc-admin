/**
 * @packageDocumentation
 * @module Person
 */

import { DataSource } from "apollo-datasource";
import {
  Person,
  PersonModelAttributes,
  PersonCreationAttributes,
  PersonUpdateAttributes,
  MemberStatusEnum,
} from "@/models/Person";
import { ContextBase } from "@/types/datasources";
import LogEntryAPI from "@/datasources/logEntry";
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

  /** The logger */
  private logger: LogEntryAPI;

  /** The sequelize connection */
  private sequelize: Sequelize.Sequelize;

  /**
   * Create the API instance.
   * @param {typeof Person} personStore - A Person store.
   * @param {Sequelize.Sequelize} sequelize - The sequelize connection.
   */
  constructor(
    personStore: typeof Person,
    logger: LogEntryAPI,
    sequelize: Sequelize.Sequelize
  ) {
    super();
    this.store = personStore;
    this.logger = logger;
    this.sequelize = sequelize;
  }

  /**
   * Count number of people
   * @async
   * @returns Number of people
   */
  public async countPeople(): Promise<number> {
    return this.store.count();
  }

  /**
   * Find all people
   * @async
   * @returns An array of people
   */
  public async findPeople(): Promise<PersonModelAttributes[]> {
    return this.store.findAll({ raw: true });
  }

  /**
   * Find all ***pending*** registrations \
   * A registration maybe for new member or for renewal of membership
   * @async
   * @returns An array of ***pending*** registrations
   */
  public async findRegistrations(): Promise<PersonModelAttributes[]> {
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
   * @returns An array of ***active and expired*** members
   */
  public async findMembers(): Promise<PersonModelAttributes[]> {
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
   * @returns The matched person or null if not found
   */
  public async findPerson(sid: string): Promise<PersonModelAttributes | null> {
    return this.store.findOne({ where: { sid }, raw: true });
  }

  /**
   * Add a new person
   * @async
   * @param arg - The arg for the new person
   * @returns An instance of the new person
   */
  public async addNewPerson(
    arg: PersonCreationAttributes,
    who: string | undefined
  ): Promise<PersonModelAttributes> {
    return this.sequelize.transaction(async (transaction) => {
      const person = await this.store.findOne({
        where: { sid: arg.sid },
        raw: true,
        transaction,
      });
      if (person) {
        if (person.status === MemberStatusEnum.Unactivated) {
          throw new Error(`SID ${arg.sid} has a registration already`);
        } else {
          throw new Error(`SID ${arg.sid} is a member already`);
        }
      }
      const newPerson = (await this.store.create(arg, { transaction })).get({
        plain: true,
      });
      await this.logger.insertLogEntry(
        {
          who,
          table: this.store.tableName,
          description: "A new person has been added",
          oldValue: null,
          newValue: newPerson,
        },
        transaction
      );
      return newPerson;
    });
  }

  /**
   * Update a person
   * @async
   * @param arg - The arg for updating the person
   * @param onlyNewRegistration - Update only if it is a new registration
   * @returns The updated people
   */
  public async updatePerson(
    arg: PersonUpdateAttributes,
    onlyNewRegistration: boolean,
    who: string | undefined
  ): Promise<PersonModelAttributes> {
    return this.sequelize.transaction(async (transaction) => {
      const conditions: Sequelize.WhereOptions<PersonModelAttributes> = {
        sid: arg.sid,
        ...(onlyNewRegistration ? { memberSince: { [Op.eq]: null } } : null),
      };
      const oldPerson = await this.store.findOne({
        where: conditions,
        raw: true,
        transaction,
      });
      if (!oldPerson) {
        throw new Error(`SID ${arg.sid} is not on the list`);
      }
      const [count, people] = await this.store.update(arg, {
        where: conditions,
        returning: true,
        transaction,
      });
      if (!count) {
        throw new Error(`Cannot update person record for sid ${arg.sid}`);
      }
      const newPerson = people[0].get({ plain: true });
      await this.logger.insertLogEntry(
        {
          who,
          table: this.store.tableName,
          description: `Student ${arg.sid} has been updated`,
          oldValue: oldPerson as PersonModelAttributes,
          newValue: newPerson,
        },
        transaction
      );
      return newPerson;
    });
  }

  /**
   * Approve someone's membership
   * @async
   * @param {ApproveMembershipAttribute} arg - The arg for the approval
   * @returns The updated person
   */
  public async approveMembership(
    { sid, memberUntil }: ApproveMembershipAttribute,
    who: string | undefined
  ): Promise<PersonModelAttributes> {
    const result = await this.sequelize.transaction(async (transaction) => {
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
        transaction,
      });
      if (!person) {
        throw new Error(`Cannot find registration record for sid ${sid}`);
      }
      const oldPerson = person.get({ plain: true });
      await person
        .set("memberUntil", memberUntil)
        .set("memberSince", DateTime.local().toISO())
        .save({ transaction });
      const newPerson = await this.store.findOne({
        where: { sid },
        transaction,
        raw: true,
      });
      await this.logger.insertLogEntry(
        {
          who,
          table: this.store.tableName,
          description: `Student ${sid}'s registration has been approved`,
          oldValue: oldPerson,
          newValue: newPerson as PersonModelAttributes | null,
        },
        transaction
      );
      return newPerson;
    });
    if (!result) {
      throw new Error(`Cannot update record for sid ${sid}`);
    }
    return result;
  }
}
