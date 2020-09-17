import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { parseCookies, destroyCookie } from "nookies";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { User } from "../apollo/server/types/datasources";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { __jwt: token } = parseCookies(ctx);
  const user: User = jwt.decode(token);
  return {
    props: { user }, // will be passed to the page component as props
  };
};

export default function Index({ user }: { user: User }): React.ReactElement {
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  });

  const logout = () => {
    router.push("/api/logout");
  };

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
