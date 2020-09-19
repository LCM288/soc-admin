/** The type of a login user */
export type User = {
  /** The student id of the user */
  sid: string;
  /** The English name of the user */
  name: string;
  /** The remote address of the user's last login */
  addr: string | null;
};

/** The base context type for the apollo server */
export type ContextBase = {
  /** The user under the context */
  user?: User;
};
