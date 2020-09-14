import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    users: [User!]!
    tests: [Test!]!
    faculties: [Faculty!]!
    faculty(code: String): Faculty
    majors: [Major!]!
    major(code: String): Major
  }

  type Mutation {
    insertTestMessage(message: String!): TestUpdateResponse!
  }

  type User {
    id: Int!
    firstName: String
  }

  type Test {
    id: ID!
    message: String
  }

  type Faculty {
    code: String!
    chinese_name: String
    english_name: String
  }

  type Major {
    code: String!
    chinese_name: String
    english_name: String
    faculties: [Faculty]
  }

  type TestUpdateResponse {
    success: Boolean!
    message: String
    test: Test
  }
`;

export default typeDefs;
