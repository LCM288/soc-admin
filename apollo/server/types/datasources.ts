/** A login user */
export interface User {
  /** The student id of the user */
  sid: string;
  /** The English name of the user */
  name: string;
  /** The remote address of the user's last login */
  addr: string | null;
}

/** The base context for the apollo server */
export interface ContextBase {
  /** The user under the context */
  user: User | null;
}
