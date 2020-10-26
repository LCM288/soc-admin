/**
 * @packageDocumentation
 * @module College
 */

import gql from "graphql-tag";

/** A college */
export interface College {
  /** College code */
  code: string;
  /** College's Chinese name */
  chineseName: string;
  /** College's English name */
  englishName: string;
}

/**
 * The graphql schema definition for the College type
 * @internal
 */
export const typeDefs = gql`
  type College {
    code: String!
    chineseName: String
    englishName: String
  }
`;
