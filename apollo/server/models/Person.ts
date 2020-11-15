/**
 * @packageDocumentation
 * @module Person
 */

import { Sequelize, Model, DataTypes } from "sequelize";
import gql from "graphql-tag";
import { Major } from "@/models/Major";
import { College } from "@/models/College";
import {
  GenderEnum,
  CollegeEnum,
  MemberStatusEnum,
  RegistrationTypeEnum,
  PersonAttributes,
  PersonModelAttributes,
  PersonCreationAttributes,
  statusOf,
  registrationTypeOf,
} from "@/utils/Person";

export {
  GenderEnum,
  CollegeEnum,
  MemberStatusEnum,
  RegistrationTypeEnum,
  statusOf,
  registrationTypeOf,
} from "@/utils/Person";
export type {
  PersonAttributes,
  ModelTimestamps,
  PersonModelAttributes,
  PersonCreationAttributes,
  PersonUpdateAttributes,
} from "@/utils/Person";

/** A class for the Person model */
export class Person
  extends Model<PersonModelAttributes, PersonCreationAttributes>
  implements PersonAttributes {
  public id!: number;

  /** The student id of the student */
  public sid!: string;

  public chineseName!: string | null;

  public englishName!: string;

  public gender!: GenderEnum | null;

  public dateOfBirth!: string | null;

  public email!: string | null;

  public phone!: string | null;

  public college!: CollegeEnum | College;

  /** The major program's code of the student */
  public major!: string | Major;

  /** The date that the student entered the university */
  public dateOfEntry!: string;

  public expectedGraduationDate!: string;

  /**
   * The date that the student became a member of the society. \
   * Null for non-member
   */
  public memberSince!: string | null;

  /** The date that the membership expires, null for until grad */
  public memberUntil!: string | null;

  /** The status of the person */
  public get status(): MemberStatusEnum {
    return statusOf(this);
  }

  /** The type of the registration */
  public get registrationType(): RegistrationTypeEnum | null {
    return registrationTypeOf(this);
  }

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

/** A helper function to create a store for the Person model
 * @param {Sequelize} sequelize - the database connection
 * @returns {typeof Person} The created store
 * @category Factory
 */
export const PersonFactory = (sequelize: Sequelize): typeof Person => {
  Person.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      sid: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
      },
      chineseName: {
        type: DataTypes.STRING(20),
      },
      englishName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM,
        values: Object.values(GenderEnum),
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING(30),
      },
      college: {
        type: DataTypes.ENUM,
        values: Object.values(CollegeEnum),
        allowNull: false,
      },
      major: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      dateOfEntry: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      expectedGraduationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      memberSince: {
        type: DataTypes.DATE,
      },
      memberUntil: {
        type: DataTypes.DATEONLY,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "people",
    }
  );
  return Person;
};

/**
 * The graphql schema definition for the Person type and related enums
 * @internal
 */
export const typeDefs = gql`
  enum Gender_ENUM {
    Male
    Female
    None
  }

  enum College_ENUM {
    CC
    UC
    NA
    SC
    MC
    SHHO
    CW
    WYS
    LWS
    GS
    None
  }

  enum MemberStatus_ENUM {
    Unactivated
    Activated
    Expired
  }

  enum RegistrationType_ENUM {
    New
    Renewal
  }

  type Person {
    id: ID!
    sid: String!
    chineseName: String
    englishName: String!
    gender: Gender_ENUM
    dateOfBirth: Date
    email: String
    phone: String
    dateOfEntry: Date!
    expectedGraduationDate: Date!
    memberSince: Date
    memberUntil: Date
    status: MemberStatus_ENUM!
    registrationType: RegistrationType_ENUM
    updatedAt: DateTime!
  }
`;
