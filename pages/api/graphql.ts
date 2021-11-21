import apolloServer from "@/apolloServer";
import microCors from "micro-cors";
import process from "process";
import { NextApiRequest, NextApiResponse } from "next";

const cors = microCors({
  origin: process.env.CORS_ORIGINS ?? "*",
  allowHeaders: [
    "X-Requested-With",
    "Access-Control-Allow-Origin",
    "X-HTTP-Method-Override",
    "Content-Type",
    "Authorization",
    "Accept",
    "Apollo-Query-Plan-Experimental",
    "X-Apollo-Tracing",
  ],
});

export default cors((req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  return apolloServer.createHandler({ path: "/api/graphql" })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
