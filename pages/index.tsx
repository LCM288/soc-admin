import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { getUserAndRefreshToken } from "utils/auth";

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
