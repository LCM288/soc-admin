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
 * @returns {Promise<string | undefined>} the jwt secret
 */
const getJwtSecret = async (): Promise<string | undefined> => {
  const entry = await socSettingStore.findOne({
    where: { key: "jwt_secret" },
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
  const jwtSecret = secret ?? (await getJwtSecret());
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
 * @param {GetServerSidePropsContext} ctx - The server side props context
 * @returns {Promise<User | undefined>} decoded user or undefined if invalid
 */
export const getUserAndRefreshToken = async (
  ctx: GetServerSidePropsContext
): Promise<User | undefined> => {
  const cookies = parseCookies(ctx);
  const token =
    process.env.NODE_ENV === "development"
      ? cookies.jwt
      : cookies["__Host-jwt"];
  const jwtSecret = await getJwtSecret();
  const addr = getClientIp(ctx.req);
  if (!jwtSecret) {
    return undefined;
  }
  try {
    const user = <User>jwt.verify(token, jwtSecret);
    if (addr !== user.addr) return undefined;

    // issue new token whenever possible
    const newToken = await issureJwt(user, jwtSecret);
    if (newToken) {
      setJwtHeader(newToken, ctx.res);
    }

    return user;
  } catch {
    return undefined;
  }
};

/**
 * Get user from the request using the authorization header
 * @async
 * @param {string} token - The jwt token
 * @returns decoded user or undefined if invalid
 */
export const getUser = async (
  req: IncomingMessage
): Promise<User | undefined> => {
  const jwtSecret = await getJwtSecret();
  if (!jwtSecret) {
    return undefined;
  }

  const addr = getClientIp(req);
  if (!req.headers.authorization) {
    return undefined;
  }

  const [type, token] = req.headers.authorization.split(" ");
  if (type.toLowerCase() !== "bearer") {
    return undefined;
  }
  try {
    const user = <User>jwt.verify(token, jwtSecret);
    if (addr !== user.addr) return undefined;
    return user;
  } catch {
    return undefined;
  }
};
