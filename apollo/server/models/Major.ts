/**
 * @packageDocumentation
 * @module Major
 */

import { gql } from "apollo-server";

/** The type for a major program */
export type Major = {
  /** Major program code */
  code: string;
  /** Major program's Chinese name */
  chineseName: string;
  /** Major program's English name */
  englishName: string;
  /** The faculties that the major program belongs to */
  faculties: string[];
};

/** The graphql schema definition for the Major type */
export const typeDefs = gql`
  type Major {
    code: String!
    chineseName: String
    englishName: String
    faculties: [Faculty]
  }
`;
