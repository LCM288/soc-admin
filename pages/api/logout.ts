import { NextApiRequest, NextApiResponse } from "next";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.setHeader(
    "Set-Cookie",
    `__jwt=; Max-Age=1; Path=/; HttpOnly; SameSite=Strict`
  );
  res.redirect("/");
};
