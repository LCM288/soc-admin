import { GetServerSidePropsContext } from "next";
import { IncomingMessage, ServerResponse } from "http";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import { User } from "@/types/datasources";
import { socSettingStore } from "@/store";
import { getClientIp } from "request-ip";

export const JWT_SECRET_KEY = "jwt_secret";
export const CLIENT_ID_KEY = "client_id";
export const CLIENT_SECRET_KEY = "client_secret";

/**
 * Get a specific settings from the database
 * @async
 * @arg key - The key of the settings
 * @returns the value of the corresponding key
 */
export const getSetting = async (key: string): Promise<string | undefined> => {
  const entry = await socSettingStore.findOne({
    where: { key },
  });
  return entry?.getDataValue("value");
};

/**
 * Issue a jwt token for a user
 * @async
 * @param {User} user - The user object to be encrypted
 * @param {string} secret - The jwt secret
 * @returns {Promise<string | undefined>} the issued token
 */
export const issureJwt = async (
  user: User,
  secret?: string
): Promise<string | undefined> => {
  const jwtSecret = secret ?? (await getSetting(JWT_SECRET_KEY));
  if (!jwtSecret) {
    return undefined;
  }
  const token = jwt.sign(
    { sid: user.sid, name: user.name, addr: user.addr },
    jwtSecret,
    { expiresIn: "30m" }
  );
  return token;
};

/**
 * Set the response header to set cookie for jwt token
 * @param {string} token - The jwt token to be set
 * @param {ServerResponse} res - The server response object
 */
export const setJwtHeader = (token: string, res: ServerResponse): void => {
  if (process.env.NODE_ENV === "development") {
    res.setHeader(
      "Set-Cookie",
      `jwt=${token}; Max-Age=1800; Path=/; HttpOnly; SameSite=Strict`
    );
  } else {
    res.setHeader(
      "Set-Cookie",
      `__Host-jwt=${token}; Max-Age=1800; Path=/; HttpOnly; Secure; SameSite=Strict`
    );
  }
};

/**
 * Get user through the cookie and update the token
 * @async
 * @param ctx - The server side props context
 * @returns decoded user or undefined if invalid
 */
export const getUserAndRefreshToken = async (
  ctx: GetServerSidePropsContext
): Promise<User | null> => {
  const cookies = parseCookies(ctx);
  const token =
    process.env.NODE_ENV === "development"
      ? cookies.jwt
      : cookies["__Host-jwt"];
  const jwtSecret = await getSetting(JWT_SECRET_KEY);
  const addr = getClientIp(ctx.req);
  if (!jwtSecret) {
    return null;
  }
  try {
    const user = <User>jwt.verify(token, jwtSecret);
    if (addr !== user.addr) return null;

    // issue new token whenever possible
    const newToken = await issureJwt(user, jwtSecret);
    if (newToken) {
      setJwtHeader(newToken, ctx.res);
    }

    return user;
  } catch {
    return null;
  }
};

/**
 * Get user from the request using the authorization header
 * @async
 * @param {string} token - The jwt token
 * @returns decoded user or undefined if invalid
 */
export const getUser = async (req: IncomingMessage): Promise<User | null> => {
  const cookies = parseCookies({ req });
  const token =
    process.env.NODE_ENV === "development"
      ? cookies.jwt
      : cookies["__Host-jwt"];
  const jwtSecret = await getSetting(JWT_SECRET_KEY);
  if (!jwtSecret) {
    return null;
  }

  const addr = getClientIp(req);
  try {
    const user = <User>jwt.verify(token, jwtSecret);
    if (addr !== user.addr) return null;
    return user;
  } catch {
    return null;
  }
};
