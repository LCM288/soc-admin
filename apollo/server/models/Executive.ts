import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { gql } from "apollo-server";

/** All the attributes in the Executive model */
export interface ExecutiveAttributes {
  id: number;
  sid: string;
  nickname: string | null;
  pos: string | null;
}

/** All the attributes needed to create an instance of the Executive model */
export type ExecutiveCreationAttributes = Optional<ExecutiveAttributes, "id">;

/** A class for the Executive model */
export class Executive
  extends Model<ExecutiveAttributes, ExecutiveCreationAttributes>
  implements ExecutiveAttributes {
  public id!: number;

  public sid!: string;

  public nickname!: string | null;

  public pos!: string | null;
}

/** A helper function to create a store for the Executive model
 * @param {Sequelize} sequelize - the database connection
 * @returns {typeof Executive} The created store
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

/** The graphql schema definition for the Executive type */
export const typeDefs = gql`
  type Executive {
    id: ID!
    sid: String!
    nickname: String
    pos: String
  }
`;
