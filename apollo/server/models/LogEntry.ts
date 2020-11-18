/**
 * @packageDocumentation
 * @module LogEntry
 */

import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import gql from "graphql-tag";

/** All the attributes in the LogEntry model */
export interface LogEntryAttributes {
  id: number;
  who: string;
  table: string;
  /** a brief description of the action */
  description: string;
  /** in JSON format */
  oldValue: string;
  /** in JSON format */
  newValue: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/** All the attributes needed to create an instance of the LogEntry model */
export type LogEntryCreationAttributes = Optional<
  LogEntryAttributes,
  "id" | "createdAt" | "updatedAt"
>;

/** A class for the LogEntry model */
export class LogEntry
  extends Model<LogEntryAttributes, LogEntryCreationAttributes>
  implements LogEntryAttributes {
  public id!: number;

  public who!: string;

  public table!: string;

  /** a brief description of the action */
  public description!: string;

  /** in JSON format */
  public oldValue!: string;

  /** in JSON format */
  public newValue!: string;

  // timestamps!
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

/** A helper function to create a store for the LogEntry model
 * @param {Sequelize} sequelize - the database connection
 * @returns {typeof LogEntry} The created store
 * @category Factory
 */
export const LogEntryFactory = (sequelize: Sequelize): typeof LogEntry => {
  LogEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      who: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      table: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      oldValue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      newValue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "log_entries",
    }
  );
  return LogEntry;
};

/**
 * The graphql schema definition for the LogEntry type
 * @internal
 */
export const typeDefs = gql`
  type LogEntry {
    id: ID!
    who: String!
    table: String!
    description: String!
    oldValue: String!
    newValue: String!
    updatedAt: DateTime!
  }
`;
