import { NextApiRequest, NextApiResponse } from "next";
import { getClientIp } from "request-ip";
import { issureJwt, setJwtHeader } from "utils/auth";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (process.env.NODE_ENV !== "development") {
    res.status(404).end("404 Not Found");
    return;
  }
  const { sid, name } = req.query;
  if (typeof sid !== "string") {
    res.status(400).end("sid not specified");
    return;
  }
  if (typeof name !== "string") {
    res.status(400).end("name not specified");
    return;
  }

  const addr = getClientIp(req);
  const user = { sid, name, addr };
  const token = await issureJwt(user);

  if (!token) {
    res.status(500).end("Cannot find issue jwt.");
    return;
  }

  setJwtHeader(token, res);
  res.end("<script>window.location.href='/'</script>");
};
