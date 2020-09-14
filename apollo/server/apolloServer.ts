import * as apolloServerMicro from "apollo-server-micro";
import typeDefs from "./schema";
import { typeDefs as personTypeDefs } from "../../models/Person";
import resolvers from "./resolvers";
import {
  typeDefs as personExtendDefs,
  resolvers as personResolvers,
  PersonAPI,
} from "./datasources/person";

import TestAPI from "./datasources/test";
import FacultiesAPI from "./datasources/faculties";
import MajorsAPI from "./datasources/majors";
import createStore from "./utils";

const createApolloServer = async (): Promise<
  apolloServerMicro.ApolloServer
> => {
  // creates a sequelize connection once. NOT for every request
  const store = await createStore();

  // set up any dataSources our resolvers need
  const dataSources = () => ({
    testAPI: new TestAPI({ store }),
    personAPI: new PersonAPI(store.Person),
    facultiesAPI: new FacultiesAPI(),
    majorsAPI: new MajorsAPI(),
  });

  // the function that sets up the global context for each resolver, using the req
  const context = async ({ req }) => {
    // TODO: check auth
    return {};
  };

  const schema = apolloServerMicro.makeExecutableSchema({
    typeDefs: [typeDefs, personTypeDefs, personExtendDefs],
    resolvers: [resolvers, personResolvers],
  });

  const apolloServer = new apolloServerMicro.ApolloServer({
    schema,
    dataSources,
    context,
  });
  return apolloServer;
};

export default createApolloServer;
