export type User = {
  sid: string;
  name: string;
};

export type ContextBase = {
  user: User;
};
