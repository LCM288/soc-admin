import { GetServerSidePropsContext } from "next";
import { IncomingMessage, ServerResponse } from "http";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import { User } from "@/types/datasources";
import { socSettingStore } from "@/store";
import { getClientIp } from "request-ip";

/**
 * Get the jwt secret from the database
 * @async
 * @returns {Promise<string | null>} the jwt secret
 */
const getJwtSecret = async (): Promise<string | null> => {
  try {
    const entry = await socSettingStore.findOne({
      where: { key: "jwt_secret" },
    });
    return entry.getDataValue("value");
  } catch {
    return null;
  }
};

/**
 * Issue a jwt token for a user
 * @async
 * @param {User} user - The user object to be encrypted
 * @param {string} secret - The jwt secret
 * @returns {Promise<string | null>} the issued token
 */
export const issureJwt = async (
  user: User,
  secret?: string
): Promise<string | null> => {
  const jwtSecret = secret || (await getJwtSecret());
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
 * @param {GetServerSidePropsContext} ctx - The server side props context
 * @returns {Promise<User | null>} decoded user or null if invalid
 */
export const getUserAndRefreshToken = async (
  ctx: GetServerSidePropsContext
): Promise<User | null> => {
  const cookies = parseCookies(ctx);
  const token =
    process.env.NODE_ENV === "development"
      ? cookies.jwt
      : cookies["__Host-jwt"];
  const jwtSecret = await getJwtSecret();
  const addr = getClientIp(ctx.req);
  try {
    const user = <User>jwt.verify(token, jwtSecret);
    if (addr !== user.addr) return null;

    // issue new token whenever possible
    const newToken = await issureJwt(user, jwtSecret);
    setJwtHeader(newToken, ctx.res);

    return user;
  } catch {
    return null;
  }
};

/**
 * Get user from the request using the authorization header
 * @async
 * @param {string} token - The jwt token
 * @returns {Promise<User | null>} decoded user or null if invalid
 */
export const getUser = async (req: IncomingMessage): Promise<User | null> => {
  const jwtSecret = await getJwtSecret();
  const addr = getClientIp(req);
  const token = req.headers.authorization || "";
  try {
    const user = <User>jwt.verify(token, jwtSecret);
    if (addr !== user.addr) return null;
    return user;
  } catch {
    return null;
  }
};
