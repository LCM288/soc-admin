import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    users: [User!]!
    tests: [Test!]!
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

  type TestUpdateResponse {
    success: Boolean!
    message: String
    test: Test
  }
`;

export default typeDefs;
