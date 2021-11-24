import { GetServerSidePropsContext } from "next";
import { IncomingMessage, ServerResponse } from "http";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";
import { User } from "@/types/datasources";
import {
  sequelize,
  socSettingStore,
  executiveStore,
  logEntryStore,
} from "@/store";

import { getClientIp } from "request-ip";

export const JWT_PUBLIC_KEY = "jwt_public_key";
export const JWT_PRIVATE_KEY = "jwt_private_key";
export const CLIENT_ID_KEY = "client_id";
export const CLIENT_SECRET_KEY = "client_secret";
export const NEW_CLIENT_ID_KEY = "new_client_id";
export const NEW_CLIENT_SECRET_KEY = "new_client_secret";

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
 * Get a specific settings from the database with timestamp
 * @async
 * @arg key - The key of the settings
 * @returns the value of the corresponding key
 */
export const getSettingWithTime = async (
  key: string
): Promise<{ value: string | undefined; updatedAt: Date | undefined }> => {
  const entry = await socSettingStore.findOne({
    where: { key },
    raw: true,
  });
  return {
    value: entry?.value,
    updatedAt: entry?.updatedAt,
  };
};

/**
 * Check whether the user is an executive
 * @async
 * @param user - The user object to be checked
 * @returns whether the user is an executive
 */
export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) {
    return false;
  }
  return Boolean(
    await executiveStore.findOne({ where: { sid: user.sid }, raw: true })
  );
};

/**
 * Get the number of executives from the database
 * @async
 * @returns Number of executives
 */
export const countExecutives = async (): Promise<number> => {
  const entries = await executiveStore.count();
  return entries;
};

/**
 * Issue a jwt token for a user
 * @async
 * @param {User} user - The user object to be encrypted
 * @param {string} privateKey - The jwt private key
 * @returns {Promise<string | undefined>} the issued token
 */
export const issueJwt = async (
  user: User,
  privateKey?: string
): Promise<string | undefined> => {
  const jwtPrivateKey = privateKey ?? (await getSetting(JWT_PRIVATE_KEY));
  if (!jwtPrivateKey) {
    return undefined;
  }
  const token = jwt.sign(
    { sid: user.sid, name: user.name, addr: user.addr },
    jwtPrivateKey,
    { expiresIn: "30m", algorithm: "RS256" }
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
  const jwtPublicKey = await getSetting(JWT_PUBLIC_KEY);
  const jwtPrivateKey = await getSetting(JWT_PRIVATE_KEY);
  const addr = getClientIp(ctx.req);
  if (!jwtPublicKey || !jwtPrivateKey) {
    return null;
  }
  try {
    const { sid, name, addr: jwtAddr } = jwt.verify(token, jwtPublicKey, {
      algorithms: ["RS256"],
    }) as Record<string, unknown>;
    const user = { sid, name, addr: jwtAddr } as User;
    if (addr !== user.addr) return null;

    // issue new token whenever possible
    const newToken = await issueJwt(user, jwtPrivateKey);
    if (newToken) {
      setJwtHeader(newToken, ctx.res);
    }

    return user;
  } catch {
    return null;
  }
};

/**
 * Get user from the request using the jwt cookie
 * @async
 * @param req - The incoming HTTP request
 * @returns decoded user or null if invalid
 */
export const getUserFromRequest = async (
  req: IncomingMessage
): Promise<User | null> => {
  const cookies = parseCookies({ req });
  const token =
    process.env.NODE_ENV === "development"
      ? cookies.jwt
      : cookies["__Host-jwt"];
  const jwtPublicKey = await getSetting(JWT_PUBLIC_KEY);
  if (!jwtPublicKey) {
    return null;
  }

  const addr = getClientIp(req);
  try {
    const user = <User>(
      jwt.verify(token, jwtPublicKey, { algorithms: ["RS256"] })
    );
    if (addr !== user.addr) return null;
    return user;
  } catch {
    return null;
  }
};

/**
 * Remove new API keys inputted from user
 * @async
 */
export const deleteNewAPIKey = async (): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    await socSettingStore.destroy({
      where: { key: NEW_CLIENT_ID_KEY },
      transaction,
    });
    await socSettingStore.destroy({
      where: { key: NEW_CLIENT_SECRET_KEY },
      transaction,
    });
    await logEntryStore.create(
      {
        who: "God",
        table: socSettingStore.tableName,
        description: "New client id & secret has been discarded",
        oldValue: JSON.stringify({
          "client id": undefined,
          "client secret": undefined,
        }),
        newValue: JSON.stringify({
          "client id": undefined,
          "client secret": undefined,
        }),
      },
      { transaction }
    );
  });
};

/**
 * Update API keys with new API keys inputted from user
 * @async
 */
export const swapAPIKey = async (): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    const newID = await socSettingStore.findOne({
      where: { key: NEW_CLIENT_ID_KEY },
      transaction,
    });
    const newIDValue = newID?.getDataValue("value");
    const newSecret = await socSettingStore.findOne({
      where: { key: NEW_CLIENT_SECRET_KEY },
      transaction,
    });
    const newSecretValue = newSecret?.getDataValue("value");
    if (!newIDValue || !newSecretValue) {
      throw new Error("Invalid Value");
    }
    await socSettingStore.upsert(
      { key: CLIENT_ID_KEY, value: newIDValue },
      { transaction }
    );
    await socSettingStore.upsert(
      { key: CLIENT_SECRET_KEY, value: newSecretValue },
      { transaction }
    );
    await socSettingStore.destroy({
      where: { key: NEW_CLIENT_ID_KEY },
      transaction,
    });
    await socSettingStore.destroy({
      where: { key: NEW_CLIENT_SECRET_KEY },
      transaction,
    });
    await logEntryStore.create(
      {
        who: "God",
        table: socSettingStore.tableName,
        description: "New client id & secret has been activated",
        oldValue: JSON.stringify({ key: CLIENT_ID_KEY }),
        newValue: JSON.stringify({ key: CLIENT_ID_KEY, value: newIDValue }),
      },
      { transaction }
    );
  });
};
