import axios from "axios";
import qs from "qs";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getJwtSecret } from "../../apollo/server/utils";
import { User } from "../../apollo/server/types/datasources";

const getAccessToken = async (
  baseUrl: string,
  code: string
): Promise<string | undefined> => {
  /* TODO put CLIENT_ID and CLIENT_SECRET to database */
  const TENANT = "link.cuhk.edu.hk";
  const CLIENT_ID = "373b4ec9-6336-4955-90cf-b7cbd9e3426f";
  const CLIENT_SECRET = "vKst47W0fi_-I~qv9zP4utA~6IOhYeHXHm";
  const REDIRECT_URI = `${baseUrl}/api/login`;

  const link = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;
  const body = qs.stringify({
    client_id: CLIENT_ID,
    scope: "user.read",
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
    client_secret: CLIENT_SECRET,
  });

  try {
    const tokenResponse = await axios.post(link, body);
    return tokenResponse.data.access_token;
  } catch {
    return undefined;
  }
};

const getUser = async (accessToken: string): Promise<User | undefined> => {
  try {
    const userDataResponse = await axios.get(
      "https://graph.microsoft.com/v1.0/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const [sid] = userDataResponse.data.userPrincipalName.split("@");
    const name = userDataResponse.data.displayName;
    return { sid, name };
  } catch {
    return undefined;
  }
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (!req.body.code) {
    res.status(400).end("No authorization code recieved.");
    return;
  }
  const { host } = req.headers;
  const protocol = /^localhost/g.test(host) ? "http" : "https";
  const baseUrl = `${protocol}://${req.headers.host}`;
  const accessToken = await getAccessToken(baseUrl, req.body.code);

  if (!accessToken) {
    res.status(401).end("No access token recieved.");
    return;
  }

  const user = await getUser(accessToken);

  if (!user) {
    res.status(401).end("Cannot access user data.");
    return;
  }

  const jwtSecret = getJwtSecret();

  if (!jwtSecret) {
    res.status(500).end("Cannot find jwtSecret.");
    return;
  }

  const token = jwt.sign(user, jwtSecret, { expiresIn: "30m" });

  res.setHeader(
    "Set-Cookie",
    `__jwt=${token}; Max-Age=1800; Path=/; HttpOnly; SameSite=Strict`
  );
  res.redirect("/");
};
