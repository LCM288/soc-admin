export interface User {
  sid: string;
}

export type ContextBase = {
  user: User;
};
