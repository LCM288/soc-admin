import * as apolloServerMicro from "apollo-server-micro";
import typeDefs from "./schema";
import resolvers from "./resolvers";

import TestAPI from "./datasources/test";
import { createStore } from "./utils";

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  testAPI: new TestAPI({ store }),
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  // TODO: check auth
  return {};
};

const apolloServer = new apolloServerMicro.ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
});

export default apolloServer;
