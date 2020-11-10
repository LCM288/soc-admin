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
    return { redirect: { permanent: false, destination: "/" } };
  }
  return {
    props: { user, isAdmin: await isAdmin(user) }, // will be passed to the page component as props
  };
};

export const getAdminPageServerSideProps: GetServerSideProps = async (ctx) => {
  const result = await getMemberPageServerSideProps(ctx);
  if (!(result as { props: ServerSideProps }).props?.isAdmin) {
    return { notFound: true };
  }
  return result;
};
