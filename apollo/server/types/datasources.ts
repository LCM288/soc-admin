export type User = {
  sid: string;
  name: string;
  addr: string | null;
};

export type ContextBase = {
  user: User;
};
