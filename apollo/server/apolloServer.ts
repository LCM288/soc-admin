import * as apolloServerMicro from "apollo-server-micro";
import { gql } from "apollo-server";
import { IncomingMessage } from "http";
import { getUserFromRequest } from "utils/auth";

// models
import { typeDefs as personTypeDefs } from "@/models/Person";
import { typeDefs as executiveTypeDefs } from "@/models/Executive";
import { typeDefs as socSettingTypeDefs } from "@/models/SocSetting";
import { typeDefs as logEntryTypeDefs } from "@/models/LogEntry";
import { typeDefs as majorTypeDefs } from "@/models/Major";
import { typeDefs as facultyTypeDefs } from "@/models/Faculty";
import { typeDefs as collegeTypeDefs } from "@/models/College";

// resolvers
import {
  DateResolver,
  DateTypeDefinition,
  DateTimeResolver,
  DateTimeTypeDefinition,
} from "graphql-scalars";
import {
  resolverTypeDefs as authResolverTypeDefs,
  resolvers as authResolvers,
} from "@/resolvers/auth";
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
  resolverTypeDefs as logEntryResolverTypeDefs,
  resolvers as logEntryResolvers,
} from "@/resolvers/logEntry";
import {
  resolverTypeDefs as facultyResolverTypeDefs,
  resolvers as facultyResolvers,
} from "@/resolvers/faculty";
import {
  resolverTypeDefs as majorResolverTypeDefs,
  resolvers as majorResolvers,
} from "@/resolvers/major";
import {
  resolverTypeDefs as collegeResolverTypeDefs,
  resolvers as collegeResolvers,
} from "@/resolvers/college";

// datasources
import PersonAPI from "@/datasources/person";
import ExecutiveAPI from "@/datasources/executive";
import SocSettingAPI from "@/datasources/socSetting";
import LogEntryAPI from "@/datasources/logEntry";
import FacultyAPI from "@/datasources/faculty";
import MajorAPI from "@/datasources/major";
import CollegeAPI from "@/datasources/college";

// others
import {
  sequelize,
  personStore,
  executiveStore,
  socSettingStore,
  logEntryStore,
} from "@/store";
import { ContextBase } from "./types/datasources";
import { ResolverDatasource } from "./types/resolver";

/**
 * Sets up any dataSources our resolvers need
 * @returns a datasource object
 * @internal
 */
const dataSources = (): ResolverDatasource => {
  const logger = new LogEntryAPI(logEntryStore);
  return {
    facultyAPI: new FacultyAPI(),
    collegeAPI: new CollegeAPI(),
    majorAPI: new MajorAPI(),
    personAPI: new PersonAPI(personStore, logger, sequelize),
    executiveAPI: new ExecutiveAPI(executiveStore, logger, sequelize),
    socSettingAPI: new SocSettingAPI(socSettingStore, logger, sequelize),
    logEntryAPI: logger,
  };
};

/**
 * The function that sets up the global context for each resolver, using the req
 * @internal
 */
const context = async ({
  req,
}: {
  req: IncomingMessage;
}): Promise<ContextBase> => {
  const user = await getUserFromRequest(req);
  return { user };
};

/**
 * A base type def for graphql
 * @internal
 */
const baseTypeDefs = gql`
  type Mutation
  type Query
  ${DateTypeDefinition}
  ${DateTimeTypeDefinition}
`;

/**
 * A micro Apollo server that would resolve any graphql queries
 */
const apolloServer = new apolloServerMicro.ApolloServer({
  typeDefs: [
    baseTypeDefs,
    authResolverTypeDefs,
    personTypeDefs,
    personResolverTypeDefs,
    executiveTypeDefs,
    executiveResolverTypeDefs,
    socSettingTypeDefs,
    socSettingResolverTypeDefs,
    logEntryTypeDefs,
    logEntryResolverTypeDefs,
    majorTypeDefs,
    majorResolverTypeDefs,
    facultyTypeDefs,
    facultyResolverTypeDefs,
    collegeTypeDefs,
    collegeResolverTypeDefs,
  ],
  resolvers: [
    { Date: DateResolver, DateTime: DateTimeResolver },
    authResolvers,
    personResolvers,
    executiveResolvers,
    socSettingResolvers,
    logEntryResolvers,
    facultyResolvers,
    majorResolvers,
    collegeResolvers,
  ],
  dataSources,
  context,
  introspection: process.env.GRAPHQL_PLAYGROUND === "enabled",
  ...(process.env.GRAPHQL_PLAYGROUND === "enabled" && {
    playground: {
      settings: {
        "request.credentials": "same-origin",
      },
    },
  }),
});

export default apolloServer;
