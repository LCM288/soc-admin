/** A login user */
export interface User {
  /** The student id of the user */
  sid: string;
  /** The English name of the user */
  name: string;
  /** Whether the user is an admin */
  isAdmin: boolean;
  /** Token expiration time in unix timestamp */
  exp: number;
}

/** The base context for the apollo server */
export interface ContextBase {
  /** The user under the context */
  user: User | null;
}
