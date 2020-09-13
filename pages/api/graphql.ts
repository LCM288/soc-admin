import apolloServer from "../../apollo/server/apolloServer";

export default apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false
  }
};
