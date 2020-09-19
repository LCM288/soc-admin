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
  /** The API for Person */
  personAPI: PersonAPI;
  /** The API for Executive */
  executiveAPI: ExecutiveAPI;
  /** The API for SocSetting */
  socSettingAPI: SocSettingAPI;
  /** The API for Major */
  majorAPI: MajorAPI;
  /** The API for Faculty */
  facultyAPI: FacultyAPI;
}

/** The parent nodes of a resolver */
export type ResolverParent = Person | Major | null;

/** The context of a resolver */
export interface ResolverContext extends ContextBase {
  /** The data source for a resolver */
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
