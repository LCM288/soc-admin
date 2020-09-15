import * as apolloServerMicro from "apollo-server-micro";
import { gql } from "apollo-server";

// models
import { typeDefs as personTypeDefs } from "./models/Person";
import { typeDefs as majorTypeDefs } from "./models/Major";
import { typeDefs as facultyTypeDefs } from "./models/Faculty";

// resolvers
import {
  typeDefs as personExtendDefs,
  resolvers as personResolvers,
} from "./resolvers/person";
import {
  typeDefs as facultyExtendDefs,
  resolvers as facultyResolvers,
} from "./resolvers/faculty";
import {
  typeDefs as majorExtendDefs,
  resolvers as majorResolvers,
} from "./resolvers/major";

// datasources
import PersonAPI from "./datasources/person";
import FacultyAPI from "./datasources/faculty";
import MajorAPI from "./datasources/major";

// store
import createStore from "./utils";

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  facultyAPI: new FacultyAPI(),
  majorAPI: new MajorAPI(),
  personAPI: new PersonAPI(store.person),
});

// the function that sets up the global context for each resolver, using the req
const context = async () => {
  // TODO: check auth
  return {};
};

const dummyTypeDefs = gql`
  type Mutation {
    dummy: Boolean
  }
  type Query {
    dummy: Boolean
  }
`;

const apolloServer = new apolloServerMicro.ApolloServer({
  typeDefs: [
    dummyTypeDefs,
    personTypeDefs,
    personExtendDefs,
    majorTypeDefs,
    majorExtendDefs,
    facultyTypeDefs,
    facultyExtendDefs,
  ],
  resolvers: [personResolvers, facultyResolvers, majorResolvers],
  dataSources,
  context,
});

export default apolloServer;
