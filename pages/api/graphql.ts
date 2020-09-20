import apolloServer from "@/apolloServer";

const graphqlWithSubscriptionHandler = (req, res, next) => {
  if (!res.socket.server.apolloServer) {
    console.log(`* apolloServer first use *`);

    apolloServer.installSubscriptionHandlers(res.socket.server);
    const handler = apolloServer.createHandler({ path: "/api/graphql" });
    res.socket.server.apolloServer = handler;
  }

  return res.socket.server.apolloServer(req, res, next);
};

export default graphqlWithSubscriptionHandler;

// export default apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};
