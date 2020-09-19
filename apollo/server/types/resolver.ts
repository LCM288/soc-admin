import { IResolvers } from "apollo-server";
import FacultyAPI from "@/datasources/faculty";
import MajorAPI from "@/datasources/major";
import PersonAPI from "@/datasources/person";
import ExecutiveAPI from "@/datasources/executive";
import SocSettingAPI from "@/datasources/socSetting";
import { Major } from "@/models/Major";
import { Person } from "@/models/Person";
import { ContextBase } from "./datasources";

/** The data source for a resolver */
export interface ResolverDatasource {
  personAPI: PersonAPI;
  executiveAPI: ExecutiveAPI;
  socSettingAPI: SocSettingAPI;
  majorAPI: MajorAPI;
  facultyAPI: FacultyAPI;
}

/** The parent nodes of a resolver */
export type ResolverParent = Person | Major | null;

/** The context of a resolver */
export interface ResolverContext extends ContextBase {
  dataSources: ResolverDatasource;
}

/** The type of a resolver
 * @param Args - The type of the arguments for the resolver
 * @param Result - The return type of the resolver
 */
export type ResolverFn<Args, Result> = (
  parent: ResolverParent,
  args: Args,
  context: ResolverContext
) => Result | Promise<Result>;

/** The type of a collection of resolvers */
export type Resolvers = IResolvers<ResolverParent, ResolverContext>;
