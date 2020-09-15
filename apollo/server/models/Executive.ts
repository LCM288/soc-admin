import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { gql } from "apollo-server";

// These are all the attributes in the Executive model
export interface ExecutiveAttributes {
  id: number;
  sid: string;
  nickname: string | null;
  pos: string | null;
}

// Some attributes are optional in `Executive.build` and `Executive.create` calls
export type ExecutiveCreationAttributes = Optional<ExecutiveAttributes, "id">;

export class Executive
  extends Model<ExecutiveAttributes, ExecutiveCreationAttributes>
  implements ExecutiveAttributes {
  public id!: number;

  public sid!: string;

  public nickname!: string | null;

  public pos!: string | null;
}

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

export const typeDefs = gql`
  type Executive {
    id: ID!
    sid: String!
    nickname: String
    pos: String
  }
`;
