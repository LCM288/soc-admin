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
import { typeDefs as collegeTypeDefs } from "@/models/College";

// resolvers
import {
  DateResolver,
  DateTypeDefinition,
  DateTimeResolver,
  DateTimeTypeDefinition,
} from "graphql-scalars";
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
import {
  resolverTypeDefs as collegeResolverTypeDefs,
  resolvers as collegeResolvers,
} from "@/resolvers/college";

// datasources
import PersonAPI from "@/datasources/person";
import ExecutiveAPI from "@/datasources/executive";
import SocSettingAPI from "@/datasources/socSetting";
import FacultyAPI from "@/datasources/faculty";
import MajorAPI from "@/datasources/major";
import CollegeAPI from "@/datasources/college";

// others
import {
  sequelize,
  personStore,
  executiveStore,
  socSettingStore,
} from "@/store";
import { ContextBase } from "./types/datasources";
import { ResolverDatasource } from "./types/resolver";

/**
 * Sets up any dataSources our resolvers need
 * @returns a datasource object
 * @internal
 */
const dataSources = (): ResolverDatasource => ({
  facultyAPI: new FacultyAPI(),
  collegeAPI: new CollegeAPI(),
  majorAPI: new MajorAPI(),
  personAPI: new PersonAPI(personStore, sequelize),
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
  const user = await getUser(req);
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
    collegeTypeDefs,
    collegeResolverTypeDefs,
  ],
  resolvers: [
    { Date: DateResolver, DateTime: DateTimeResolver },
    personResolvers,
    executiveResolvers,
    socSettingResolvers,
    facultyResolvers,
    majorResolvers,
    collegeResolvers,
  ],
  dataSources,
  context,
  playground: {
    settings: {
      "request.credentials": "same-origin",
    },
  },
});

export default apolloServer;
