import * as apolloServerMicro from "apollo-server-micro";
import { gql } from "apollo-server";
import { IncomingMessage } from "http";
import { getUser } from "utils/auth";

// models
import { typeDefs as personTypeDefs } from "@/models/Person";
import { typeDefs as executiveTypeDefs } from "@/models/Executive";
import { typeDefs as socSettingTypeDefs } from "@/models/SocSetting";
import { typeDefs as majorTypeDefs } from "@/models/Major";
import { typeDefs as facultyTypeDefs } from "@/models/Faculty";

// resolvers
import {
  resolverTypeDefs as personResolverTypeDefs,
  resolvers as personResolvers,
} from "@/resolvers/person";
import {
  resolverTypeDefs as executiveResolverTypeDefs,
  resolvers as executiveResolvers,
} from "@/resolvers/executive";
import {
  resolverTypeDefs as socSettingResolverTypeDefs,
  resolvers as socSettingResolvers,
} from "@/resolvers/socSetting";
import {
  resolverTypeDefs as facultyResolverTypeDefs,
  resolvers as facultyResolvers,
} from "@/resolvers/faculty";
import {
  resolverTypeDefs as majorResolverTypeDefs,
  resolvers as majorResolvers,
} from "@/resolvers/major";

// datasources
import PersonAPI from "@/datasources/person";
import ExecutiveAPI from "@/datasources/executive";
import SocSettingAPI from "@/datasources/socSetting";
import FacultyAPI from "@/datasources/faculty";
import MajorAPI from "@/datasources/major";

// others
import { personStore, executiveStore, socSettingStore } from "@/store";
import { ContextBase } from "./types/datasources";

/**
 * Sets up any dataSources our resolvers need
 * @returns a datasource object
 * @internal
 */
const dataSources = () => ({
  facultyAPI: new FacultyAPI(),
  majorAPI: new MajorAPI(),
  personAPI: new PersonAPI(personStore),
  executiveAPI: new ExecutiveAPI(executiveStore),
  socSettingAPI: new SocSettingAPI(socSettingStore),
});

/**
 * The function that sets up the global context for each resolver, using the req
 * @internal
 */
const context = async ({
  req,
}: {
  req: IncomingMessage;
}): Promise<ContextBase> => {
  // const user = await getUser(req);
  return { user: null };
};

/**
 * A dummy type def for graphql so that Mutation and Query can be extended
 * @internal
 */
const dummyTypeDefs = gql`
  type Mutation {
    dummy: Boolean
  }
  type Query {
    dummy: Boolean
  }
  type Subscription {
    testEmit: String
  }
`;

/**
 * A micro Apollo server that would resolve any graphql queries
 */
const apolloServer = new apolloServerMicro.ApolloServer({
  typeDefs: [
    dummyTypeDefs,
    personTypeDefs,
    personResolverTypeDefs,
    executiveTypeDefs,
    executiveResolverTypeDefs,
    socSettingTypeDefs,
    socSettingResolverTypeDefs,
    majorTypeDefs,
    majorResolverTypeDefs,
    facultyTypeDefs,
    facultyResolverTypeDefs,
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
  subscriptions: {
    path: "/api/graphql",
    keepAlive: 9000,
    onConnect: () => console.log("connected"),
    onDisconnect: () => console.log("disconnected"),
  },
});

export default apolloServer;
