import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery } from "@apollo/react-hooks";

import query from "apollo/queries/executive/executives.gql";

export const getServerSideProps: GetServerSideProps<{
  user: User | null;
}> = async (ctx) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/login");
  }
  return {
    props: { user }, // will be passed to the page component as props
  };
};

export default function Index({
  user,
}: {
  user: User | null;
}): React.ReactElement {
  const router = useRouter();
  const { data, loading, error } = useQuery(query, {
    variables: { sid: user?.sid ?? "" },
  });
  const logout = () => {
    router.push("/api/logout");
  };
  const register = () => {
    router.push("/register");
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
        <button type="button" onClick={register}>
          register
        </button>
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
}
