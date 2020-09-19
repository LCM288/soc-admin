import { gql } from "apollo-server";

/** The type for a major program */
export type Major = {
  code: string;
  chinese_name: string;
  english_name: string;
  faculties: string[];
};

/** The graphql schema definition for the Major type */
export const typeDefs = gql`
  type Major {
    code: String!
    chinese_name: String
    english_name: String
    faculties: [Faculty]
  }
`;
