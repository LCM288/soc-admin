import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { Gender, College, Person } from "./person";

export interface RegistrationAttributes extends Person {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface RegistrationModel
  extends Model<RegistrationAttributes>,
    RegistrationAttributes {}
export class Registration extends Model<
  RegistrationModel,
  RegistrationAttributes
> {}

export type RegistrationStatic = typeof Model & {
  new (values?: any, options?: BuildOptions): RegistrationModel;
};

export function RegistrationFactory(sequelize: Sequelize): RegistrationStatic {
  return <RegistrationStatic>sequelize.define("registrations", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sid: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    chineseName: {
      type: DataTypes.STRING(20),
      allowNull: false,
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
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    college: {
      type: DataTypes.ENUM,
      values: Object.values(College),
    },
    major: {
      type: DataTypes.STRING(8),
    },
    expectedGrad: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}
