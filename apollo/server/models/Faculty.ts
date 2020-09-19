/**
 * @packageDocumentation
 * @module Faculty
 */

import { gql } from "apollo-server";

/** The type for a faculty */
export type Faculty = {
  /** Faculty code */
  code: string;
  /** Faculty's Chinese name */
  chineseName: string;
  /** Faculty's English name */
  englishName: string;
};

/** The graphql schema definition for the Faculty type */
export const typeDefs = gql`
  type Faculty {
    code: String!
    chineseName: String
    englishName: String
  }
`;
