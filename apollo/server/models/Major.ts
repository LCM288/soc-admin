/**
 * @packageDocumentation
 * @module Major
 */

import gql from "graphql-tag";
import { Faculty } from "@/models/Faculty";

/** A major program */
export interface Major {
  /** Major program code */
  code: string;
  /** Major program's Chinese name */
  chineseName: string;
  /** Major program's English name */
  englishName: string;
  /** The faculties that the major program belongs to */
  faculties: string[] | Faculty[];
}

/**
 * The graphql schema definition for the Major type
 * @internal
 */
export const typeDefs = gql`
  type Major {
    code: String!
    chineseName: String
    englishName: String
    faculties: [Faculty]
  }
`;
