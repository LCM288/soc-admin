import { gql } from "apollo-server";

export type Major = {
  code: string;
  chinese_name: string;
  english_name: string;
  faculties: string[];
};

export const typeDefs = gql`
  type Major {
    code: String!
    chinese_name: String
    english_name: String
    faculties: [Faculty]
  }
`;
