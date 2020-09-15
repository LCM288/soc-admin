import FacultyAPI from "../datasources/faculty";
import MajorAPI from "../datasources/major";
import PersonAPI from "../datasources/person";
import { ContextBase } from "./datasources";

export interface ResolverDatasource {
  personAPI: PersonAPI;
  majorAPI: MajorAPI;
  facultyAPI: FacultyAPI;
}

export interface ResolverContext extends ContextBase {
  dataSources: ResolverDatasource;
}

export type ResolverFn<Parent, Args, Result> = (
  parent: Parent,
  args: Args,
  context: ResolverContext
) => Result | Promise<Result>;
