import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { gql } from "apollo-server";

enum Gender {
  Male = "Male",
  Female = "Female",
}

enum College {
  CC = "CC",
  UC = "UC",
  NA = "NA",
  SC = "SC",
  WS = "WS",
  WYS = "WYS",
  SHHO = "SHHO",
  MC = "MC",
  CW = "CW",
  None = "None",
}

/** All the attributes in the Person model */
export interface PersonAttributes {
  id: number;
  sid: string;
  chineseName: string | null;
  englishName: string;
  gender: Gender | null;
  dateOfBirth: Date | null;
  email: string | null;
  phone: string | null;
  college: College;
  major: string;
  dateOfEntry: Date;
  expectedGraduationDate: Date;
  memberSince: Date | null;
}

/** All the attributes needed to create an instance of the Person model */
export type PersonCreationAttributes = Optional<PersonAttributes, "id">;

/** A class for the Person model */
export class Person
  extends Model<PersonAttributes, PersonCreationAttributes>
  implements PersonAttributes {
  public id!: number;

  public sid!: string;

  public chineseName!: string | null;

  public englishName!: string;

  public gender!: Gender | null;

  public dateOfBirth!: Date | null;

  public email!: string | null;

  public phone!: string | null;

  public college!: College;

  public major!: string;

  public dateOfEntry!: Date;

  public expectedGraduationDate!: Date;

  public memberSince!: Date | null;

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

/** A helper function to create a store for the Person model
 * @param {Sequelize} sequelize - the database connection
 * @returns {typeof Person} The created store
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
        values: Object.values(Gender),
      },
      dateOfBirth: {
        type: DataTypes.DATE,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING(30),
      },
      college: {
        type: DataTypes.ENUM,
        values: Object.values(College),
        allowNull: false,
      },
      major: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      dateOfEntry: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expectedGraduationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      memberSince: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "people",
    }
  );
  return Person;
};

/** The graphql schema definition for the Person type and related enums */
export const typeDefs = gql`
  enum Gender {
    Male
    Female
  }

  enum College {
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
    gender: Gender
    dateOfBirth: String
    email: String
    phone: String
    college: College!
    dateOfEntry: String!
    expectedGraduationDate: String!
    memberSince: String
  }
`;
