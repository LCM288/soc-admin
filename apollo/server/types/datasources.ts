/** The type of a login user */
export type User = {
  sid: string;
  name: string;
  addr: string | null;
};

/** The base context type for the apollo server */
export type ContextBase = {
  user: User;
};
