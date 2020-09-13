import createApolloServer from "../../apollo/server/apolloServer";

export default (req, res) => {
  createApolloServer().then((apolloServer) => {
    const handler = apolloServer.createHandler({ path: "/api/graphql" });
    handler(req, res);
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
