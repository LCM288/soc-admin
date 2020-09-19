import { gql } from "apollo-server";

/** The type for a faculty */
export type Faculty = {
  code: string;
  chinese_name: string;
  english_name: string;
};

/** The graphql schema definition for the Faculty type */
export const typeDefs = gql`
  type Faculty {
    code: String!
    chinese_name: String
    english_name: String
  }
`;
