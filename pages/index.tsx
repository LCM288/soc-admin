import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import { gql } from "@apollo/client";

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

const query = gql`
  query Executive($sid: String!) {
    executive(sid: $sid) {
      id
      sid
      nickname
    }
  }
`;

const subscribe = gql`
  subscription {
    testEmit
  }
`;

export default function Index({
  user,
}: {
  user: User | null;
}): React.ReactElement {
  const router = useRouter();
  const { data, loading, error } = useQuery(query, {
    variables: { sid: user?.sid ?? "" },
  });
  const { data: subData, loading: subLoading } = useSubscription(subscribe);
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
        <h4>New comment: {!subLoading && JSON.stringify(subData)}</h4>
        <button type="button" onClick={logout}>
          logout
        </button>
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
}
