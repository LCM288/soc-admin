import axios from "axios";
import qs from "qs";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/types/datasources";
import { issureJwt, setJwtHeader } from "utils/auth";
import { getClientIp } from "request-ip";

/**
 * Get access token from microsoft
 * @async
 * @param {string} baseUrl - The base url of the server
 * @param {string} code - The authorization code
 * @returns {Promise<string | undefined>} The access token
 */
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

/**
 * Get user's data from microsoft graph api
 * @async
 * @param {NextApiRequest} req - The server request object
 * @param {string} accessToken - The access token recieved from microsoft
 * @returns {Promise<User | undefined>} A user object generated from the user data
 */
const getUser = async (
  req: NextApiRequest,
  accessToken: string
): Promise<User | undefined> => {
  try {
    const userDataResponse = await axios.get(
      "https://graph.microsoft.com/v1.0/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const [sid] = userDataResponse.data.userPrincipalName.split("@");
    const name = userDataResponse.data.displayName;
    const addr = getClientIp(req);
    return { sid, name, addr };
  } catch {
    return undefined;
  }
};

/**
 * The handler that handles the login
 * if success, set jwt token cookie and redirect to index
 * @async
 * @param {NextApiRequest} req - The server request object
 * @param {NextApiResponse} res - The server response object
 */
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (!req.body.code) {
    res.status(400).end("No authorization code recieved.");
    return;
  }
  const { host = "" } = req.headers;
  const protocol = /^localhost/g.test(host) ? "http" : "https";
  const baseUrl = `${protocol}://${req.headers.host}`;
  const accessToken = await getAccessToken(baseUrl, req.body.code);

  if (!accessToken) {
    res.status(401).end("No access token recieved.");
    return;
  }

  const user = await getUser(req, accessToken);

  if (!user) {
    res.status(401).end("Cannot access user data.");
    return;
  }

  const token = await issureJwt(user);

  if (!token) {
    res.status(500).end("Cannot find issue jwt.");
    return;
  }

  setJwtHeader(token, res);
  res.end("<script>window.location.href='/'</script>");
};
