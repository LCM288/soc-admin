import { NextApiRequest, NextApiResponse } from "next";
import { setJwtHeader } from "utils/auth";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  setJwtHeader("", res);
  res.end("<script>window.location.href='/'</script>");
};
