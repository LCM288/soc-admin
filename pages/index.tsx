import React from "react";
import { useRouter } from "next/router";
import { ServerSideProps } from "utils/getServerSideProps";
import { useQuery } from "@apollo/react-hooks";

import executiveQuery from "apollo/queries/executive/executive.gql";

export { getServerSideProps } from "utils/getServerSideProps";

export default function Index({ user }: ServerSideProps): React.ReactElement {
  const router = useRouter();
  const { data, loading, error } = useQuery(executiveQuery, {
    variables: { sid: user?.sid ?? "" },
  });
  const logout = () => {
    router.push("/api/logout");
  };
  if (loading) return <p>loading</p>;
  if (error) return <p>ERROR</p>;
  if (data?.executive) {
    router.replace("/admin");
    return <></>;
  }

  if (user) {
    return (
      <div>
        <div>Hi, {user.name}</div>
        <button type="button" onClick={logout}>
          logout
        </button>
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
}
