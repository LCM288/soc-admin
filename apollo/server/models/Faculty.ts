import { gql } from "apollo-server";

export type Faculty = {
  code: string;
  chinese_name: string;
  english_name: string;
};

export const typeDefs = gql`
  type Faculty {
    code: String!
    chinese_name: String
    english_name: String
  }
`;
