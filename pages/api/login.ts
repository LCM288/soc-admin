import axios from "axios";
import qs from "qs";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/types/datasources";
import {
  issureJwt,
  setJwtHeader,
  getSetting,
  swapAPIKey,
  NEW_CLIENT_ID_KEY,
  NEW_CLIENT_SECRET_KEY,
  CLIENT_ID_KEY,
  CLIENT_SECRET_KEY,
} from "utils/auth";
import { getClientIp } from "request-ip";

interface AccessTokenProps {
  accessToken: string;
  key: string;
}

/**
 * Get access token from microsoft
 * @async
 * @param {string} baseUrl - The base url of the server
 * @param {string} code - The authorization code
 * @returns {Promise<AccessTokenProps>} The access token and respective key used
 */
const getAccessToken = async (
  baseUrl: string,
  code: string
): Promise<AccessTokenProps> => {
  const TENANT = "link.cuhk.edu.hk";
  const newClientId = await getSetting(NEW_CLIENT_ID_KEY);
  const newClientSecret = await getSetting(NEW_CLIENT_SECRET_KEY);
  const clientId = await getSetting(CLIENT_ID_KEY);
  const clientSecret = await getSetting(CLIENT_SECRET_KEY);
  const redirectUrl = `${baseUrl}/api/login`;

  const link = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;
  const body = {
    client_id: "",
    scope: "user.read",
    code,
    redirect_uri: redirectUrl,
    grant_type: "authorization_code",
    client_secret: "",
  };

  // decision on which set of API keys to use
  if (newClientId && newClientSecret) {
    body.client_id = newClientId;
    body.client_secret = newClientSecret;
    const tokenResponse = await axios.post(link, qs.stringify(body));
    return {
      accessToken: tokenResponse.data.access_token,
      key: NEW_CLIENT_ID_KEY,
    };
  }

  if (!clientId) {
    throw new Error("Cannot find client id");
  }
  if (!clientSecret) {
    throw new Error("Cannot find client secret");
  }

  body.client_id = clientId;
  body.client_secret = clientSecret;

  const tokenResponse = await axios.post(link, qs.stringify(body));
  return { accessToken: tokenResponse.data.access_token, key: CLIENT_ID_KEY };
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

  const accessToken = await getAccessToken(baseUrl, req.body.code).catch(
    (err) => {
      res.status(500).end(err.message);
    }
  );

  if (!accessToken || res.statusCode === 500) {
    return;
  }

  if (accessToken.key === NEW_CLIENT_ID_KEY) {
    swapAPIKey();
  }

  const user = await getUser(req, accessToken.accessToken);

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
