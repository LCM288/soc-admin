import { User } from "@/types/datasources";
import { GetServerSideProps } from "next";
import { getUserAndRefreshToken, isAdmin } from "utils/auth";

export interface ServerSideProps {
  user: User | null;
  isAdmin: boolean;
}

export const getMemberPageServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/");
    return { props: { user: null, isAdmin: false } };
  }
  return {
    props: { user, isAdmin: await isAdmin(user) }, // will be passed to the page component as props
  };
};

export const getAdminPageServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = await getMemberPageServerSideProps(ctx);
  if (!props.isAdmin) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/");
    return { props: { user: null, isAdmin: false } };
  }
  return { props };
};
