/**
 * @packageDocumentation
 * @module Person
 */

import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { gql } from "apollo-server";

enum GenderEnum {
  Male = "Male",
  Female = "Female",
  None = "None",
}

/** The enum for the nine collges plus the option None */
export enum CollegeEnum {
  CC = "CC",
  UC = "UC",
  NA = "NA",
  SC = "SC",
  MC = "MC",
  SHHO = "SHHO",
  CW = "CW",
  WYS = "WYS",
  LWS = "LWS",
  GS = "GS",
  None = "None",
}

/** All the attributes in the Person model */
export interface PersonAttributes {
  id: number;
  /** The student id of the student */
  sid: string;
  chineseName: string | null;
  englishName: string;
  gender: GenderEnum | null;
  dateOfBirth: Date | null;
  email: string | null;
  phone: string | null;
  college: CollegeEnum;
  /** The major program's code of the student */
  major: string;
  /** The date that the student entered the university */
  dateOfEntry: Date;
  expectedGraduationDate: Date;
  /**
   * The date that the student became a member of the society \
   * Null for non-member
   */
  memberSince: Date | null;
  /** The date that the membership expires, null for until grad */
  memberUntil: Date | null;
}

/** All the attributes needed to create an instance of the Person model */
export type PersonCreationAttributes = Optional<PersonAttributes, "id">;

/** All the attributes needed to update an instance of the Person model */
export type PersonUpdateAttributes = Partial<PersonAttributes> &
  Pick<PersonAttributes, "sid">;

/** A class for the Person model */
export class Person
  extends Model<PersonAttributes, PersonCreationAttributes>
  implements PersonAttributes {
  public id!: number;

  /** The student id of the student */
  public sid!: string;

  public chineseName!: string | null;

  public englishName!: string;

  public gender!: GenderEnum | null;

  public dateOfBirth!: Date | null;

  public email!: string | null;

  public phone!: string | null;

  public college!: CollegeEnum;

  /** The major program's code of the student */
  public major!: string;

  /** The date that the student entered the university */
  public dateOfEntry!: Date;

  public expectedGraduationDate!: Date;

  /**
   * The date that the student became a member of the society. \
   * Null for non-member
   */
  public memberSince!: Date | null;

  /** The date that the membership expires, null for until grad */
  public memberUntil!: Date | null;

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
        type: DataTypes.DATEONLY,
      },
      memberUntil: {
        type: DataTypes.DATEONLY,
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
    WS
    WYS
    SHHO
    MC
    CW
    None
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
  }
`;
