import { User } from "@/types/datasources";
import { GetServerSideProps } from "next";
import { getUserAndRefreshToken, isAdmin } from "utils/auth";

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/login");
  }
  return {
    props: { user, isAdmin: await isAdmin(user) }, // will be passed to the page component as props
  };
};

export const getAdminPageServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = await getServerSideProps(ctx);
  if (!props.isAdmin) {
    ctx.res.statusCode = 401;
    ctx.res.end("401 Unauthorized");
  }
  return { props };
};

export interface ServerSideProps {
  user: User | null;
  isAdmin: boolean;
}
