import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";

import query from "apollo/queries/executive/executives.gql";

interface Props {
  user: User | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/login");
  }
  return {
    props: { user }, // will be passed to the page component as props
  };
};

const Index: React.FunctionComponent<Props> = ({ user }: Props) => {
  const router = useRouter();
  const { data, loading, error } = useQuery(query, {
    variables: { sid: user?.sid ?? "" },
  });
  const logout = () => {
    router.push("/api/logout");
  };
  if (loading) return <p>loading</p>;
  if (error) return <p>ERROR</p>;

  if (user) {
    return (
      <div>
        <div>Hi, {user.name}</div>
        <div>{JSON.stringify(data)}</div>
        <button type="button" onClick={logout}>
          logout
        </button>
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
};

((Index as unknown) as { Layout: React.ComponentType }).Layout = Layout;

export default Index;
