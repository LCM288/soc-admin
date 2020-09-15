import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { gql } from "apollo-server";

// These are all the attributes in the Executive model
export interface SocSettingAttributes {
  id: number;
  key: string;
  value: string;
}

// Some attributes are optional in `Executive.build` and `Executive.create` calls
export type SocSettingCreationAttributes = Optional<SocSettingAttributes, "id">;

export class SocSetting
  extends Model<SocSettingAttributes, SocSettingCreationAttributes>
  implements SocSettingAttributes {
  public id!: number;

  public key!: string;

  public value!: string;
}

export const SocSettingFactory = (sequelize: Sequelize): typeof SocSetting => {
  SocSetting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "soc_settings",
    }
  );
  return SocSetting;
};

export const typeDefs = gql`
  type SocSetting {
    id: ID!
    key: String!
    value: String!
  }
`;
