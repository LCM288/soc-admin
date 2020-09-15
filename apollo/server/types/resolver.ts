import { IResolvers } from "apollo-server";
import FacultyAPI from "../datasources/faculty";
import MajorAPI from "../datasources/major";
import PersonAPI from "../datasources/person";
import { Major } from "../models/Major";
import { Person } from "../models/Person";
import { ContextBase } from "./datasources";

export interface ResolverDatasource {
  personAPI: PersonAPI;
  majorAPI: MajorAPI;
  facultyAPI: FacultyAPI;
}

export type ResolverParent = Person | Major | undefined;

export interface ResolverContext extends ContextBase {
  dataSources: ResolverDatasource;
}

export type ResolverFn<Args, Result> = (
  parent: ResolverParent,
  args: Args,
  context: ResolverContext
) => Result | Promise<Result>;

export type Resolvers = IResolvers<ResolverParent, ResolverContext>;
