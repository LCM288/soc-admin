/**
 * @packageDocumentation
 * @module SocSetting
 */

import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { gql } from "apollo-server";

/** All the attributes in the SocSetting model */
export interface SocSettingAttributes {
  id: number;
  key: string;
  value: string;
}

/** All the attributes needed to create an instance of the SocSetting model */
export type SocSettingCreationAttributes = Optional<SocSettingAttributes, "id">;

/** All the attributes needed to destroy instance(s) of the SocSetting model */
export type SocSettingDestroyAttributes = Optional<
  SocSettingAttributes,
  "id" | "key" | "value"
>;

/** A class for the SocSetting model */
export class SocSetting
  extends Model<SocSettingAttributes, SocSettingCreationAttributes>
  implements SocSettingAttributes {
  public id!: number;

  public key!: string;

  public value!: string;

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

/** A helper function to create a store for the SocSetting model
 * @param {Sequelize} sequelize - the database connection
 * @returns {typeof SocSetting} The created store
 * @category Factory
 */
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

/**
 * The graphql schema definition for the SocSetting type
 * @internal
 */
export const typeDefs = gql`
  type SocSetting {
    id: ID!
    key: String!
    value: String!
  }
`;
