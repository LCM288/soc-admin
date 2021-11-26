import { NextApiRequest, NextApiResponse } from "next";
import { getClientIp } from "request-ip";
import { isAdmin, issueJwt, setJwtHeader } from "utils/auth";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (process.env.LOGIN_AS !== "enabled") {
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
  // we will check whether the user is an admin when issuing jwt
  const user = { sid, name, addr, isAdmin: false };
  const token = await issueJwt(user);

  if (!token) {
    res.status(500).end("Cannot find issue jwt.");
    return;
  }

  setJwtHeader(token, res);
  res.end("<script>window.location.href='/'</script>");
};
