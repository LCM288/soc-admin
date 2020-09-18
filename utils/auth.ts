import { GetServerSidePropsContext } from "next";
import { ServerResponse } from "http";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import { User } from "@/types/datasources";
import { socSettingStore } from "@/store";

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

export const getUser = async (
  ctx: GetServerSidePropsContext
): Promise<User | null> => {
  const cookies = parseCookies(ctx);
  const token =
    process.env.NODE_ENV === "development"
      ? cookies.jwt
      : cookies["__Host-jwt"];
  const jwtSecret = await getJwtSecret();
  try {
    const user = <User>jwt.verify(token, jwtSecret);
    return user;
  } catch {
    return null;
  }
};

export const issureJwt = async (user: User): Promise<string | null> => {
  const jwtSecret = await getJwtSecret();
  const token = jwt.sign(user, jwtSecret, { expiresIn: "30m" });
  return token;
};

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
