import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { Gender, College, Person } from "./person";

export interface MemberAttributes extends Person {
  memberSince: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface MemberModel
  extends Model<MemberAttributes>,
    MemberAttributes {}
export class Member extends Model<MemberModel, MemberAttributes> {}

export type MemberStatic = typeof Model & {
  new (values?: any, options?: BuildOptions): MemberModel;
};

export function MemberFactory(sequelize: Sequelize): MemberStatic {
  return <MemberStatic>sequelize.define("members", {
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
    memberSince: {
      type: DataTypes.DATE,
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
