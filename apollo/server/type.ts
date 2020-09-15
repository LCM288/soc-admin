export interface User {
  sid: string;
}

export type Context = {
  user: User;
};
