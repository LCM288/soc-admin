import * as apolloServerMicro from "apollo-server-micro";
import { gql } from "apollo-server";

// models
import { typeDefs as personTypeDefs } from "./models/Person";
import { typeDefs as executiveTypeDefs } from "./models/Executive";
import { typeDefs as socSettingTypeDefs } from "./models/SocSetting";
import { typeDefs as majorTypeDefs } from "./models/Major";
import { typeDefs as facultyTypeDefs } from "./models/Faculty";

// resolvers
import {
  typeDefs as personExtendDefs,
  resolvers as personResolvers,
} from "./resolvers/person";
import {
  typeDefs as executiveExtendDefs,
  resolvers as executiveResolvers,
} from "./resolvers/executive";
import {
  typeDefs as socSettingExtendDefs,
  resolvers as socSettingResolvers,
} from "./resolvers/socSetting";
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
import ExecutiveAPI from "./datasources/executive";
import SocSettingAPI from "./datasources/socSetting";
import FacultyAPI from "./datasources/faculty";
import MajorAPI from "./datasources/major";

// store
import { createStore } from "./utils";

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  facultyAPI: new FacultyAPI(),
  majorAPI: new MajorAPI(),
  personAPI: new PersonAPI(store.person),
  executiveAPI: new ExecutiveAPI(store.executive),
  socSettingAPI: new SocSettingAPI(store.socSetting),
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
    executiveTypeDefs,
    executiveExtendDefs,
    socSettingTypeDefs,
    socSettingExtendDefs,
    majorTypeDefs,
    majorExtendDefs,
    facultyTypeDefs,
    facultyExtendDefs,
  ],
  resolvers: [
    personResolvers,
    executiveResolvers,
    socSettingResolvers,
    facultyResolvers,
    majorResolvers,
  ],
  dataSources,
  context,
});

export default apolloServer;
