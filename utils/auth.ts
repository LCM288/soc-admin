import { GetServerSidePropsContext } from "next";
import { ServerResponse } from "http";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import { User } from "@/types/datasources";
import { socSettingStore } from "@/store";
import { getClientIp } from "request-ip";

/**
 * Get the jwt secret from the database
 * @returns the jwt secret
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
 * @param {User} user - The user object to be encrypted
 * @param {string} secret - The jwt secret
 * @returns the issued token
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
 * Get user through the header and update the token
 * @param {GetServerSidePropsContext} ctx - The server side props context
 * @returns decoded user or null if invalid
 */
export const getUser = async (
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
