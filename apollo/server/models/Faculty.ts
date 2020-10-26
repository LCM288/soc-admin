/**
 * @packageDocumentation
 * @module Faculty
 */

import gql from "graphql-tag";

/** A faculty */
export interface Faculty {
  /** Faculty code */
  code: string;
  /** Faculty's Chinese name */
  chineseName: string;
  /** Faculty's English name */
  englishName: string;
}

/**
 * The graphql schema definition for the Faculty type
 * @internal
 */
export const typeDefs = gql`
  type Faculty {
    code: String!
    chineseName: String
    englishName: String
  }
`;
