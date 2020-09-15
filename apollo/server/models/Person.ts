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

// These are all the attributes in the Person model
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
}

// Some attributes are optional in `Person.build` and `Person.create` calls
export type PersonCreationAttributes = Optional<PersonAttributes, "id">;

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

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

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
    },
    {
      sequelize,
      tableName: "people",
    }
  );
  return Person;
};

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
  }
`;
