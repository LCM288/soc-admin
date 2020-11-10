import { User } from "@/types/datasources";
import { GetServerSideProps } from "next";
import { getUserAndRefreshToken, isAdmin } from "utils/auth";

export interface ServerSideProps {
  user: User | null;
  isAdmin: boolean;
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx
) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    return { redirect: { permanent: false, destination: "/login" } };
  }
  return {
    props: { user, isAdmin: await isAdmin(user) }, // will be passed to the page component as props
  };
};

export const getAdminPageServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = (await getServerSideProps(ctx)) as {
    props?: ServerSideProps;
  };
  if (!props?.isAdmin) {
    return { notFound: true };
  }
  return { props };
};
