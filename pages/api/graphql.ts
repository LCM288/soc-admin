import apolloServer from "@/apolloServer";
import WebSocket from "ws";

const handler = apolloServer.createHandler({ path: "/api/graphql" });

const graphqlWithSubscriptionHandler = (
  req: unknown,
  res: { socket: { server: WebSocket.Server } }
): Promise<void> => {
  apolloServer.installSubscriptionHandlers(res.socket.server);
  return handler(req, res);
};

export default graphqlWithSubscriptionHandler;

// export default apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};
