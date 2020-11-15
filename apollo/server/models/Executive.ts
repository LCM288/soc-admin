/**
 * @packageDocumentation
 * @module Executive
 */

import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import gql from "graphql-tag";

/** All the attributes in the Executive model */
export type ExecutiveAttributes = {
  id: number;
  /** Thd student id of the executive member */
  sid: string;
  nickname: string | null;
  /** Thd position of the executive member */
  pos: string | null;
};

/** All the attributes needed to create an instance of the Executive model */
export type ExecutiveCreationAttributes = Optional<ExecutiveAttributes, "id">;

/** All the attributes needed to update an instance of the Executive model */
export type ExecutiveUpdateAttributes = Partial<ExecutiveAttributes> &
  Pick<ExecutiveAttributes, "sid">;

/** A class for the Executive model */
export class Executive
  extends Model<ExecutiveAttributes, ExecutiveCreationAttributes>
  implements ExecutiveAttributes {
  public id!: number;

  /** Thd student id of the executive member */
  public sid!: string;

  public nickname!: string | null;

  /** Thd position of the executive member */
  public pos!: string | null;

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

/** A helper function to create a store for the Executive model
 * @param {Sequelize} sequelize - the database connection
 * @returns {typeof Executive} The created store
 * @category Factory
 */
export const ExecutiveFactory = (sequelize: Sequelize): typeof Executive => {
  Executive.init(
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
      nickname: {
        type: DataTypes.STRING(20),
      },
      pos: {
        type: DataTypes.STRING(20),
      },
    },
    {
      sequelize,
      tableName: "executives",
    }
  );
  return Executive;
};

/**
 * The graphql schema definition for the Executive type
 * @internal
 */
export const typeDefs = gql`
  type Executive {
    id: ID!
    sid: String!
    nickname: String
    pos: String
  }
`;
