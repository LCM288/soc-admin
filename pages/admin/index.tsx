import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";

import query from "apollo/queries/executive/executives.gql";

export { getServerSideProps } from "utils/getServerSideProps";

export default function Index({ user }: ServerSideProps): React.ReactElement {
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
}

Index.Layout = Layout;
