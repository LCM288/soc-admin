import { User } from "@/types/datasources";
import { GetServerSideProps } from "next";
import { getUserAndRefreshToken } from "utils/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/login");
  }
  return {
    props: { user }, // will be passed to the page component as props
  };
};

export interface ServerSideProps {
  user: User | null;
}
