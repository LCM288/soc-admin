import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { setJwtHeader } from "utils/auth";
import { useRouter } from "next/router";
import toast from "utils/toast";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  setJwtHeader("", ctx.res);
  return {
    props: {},
  };
};

const Logout = (): React.ReactElement => {
  const router = useRouter();
  useEffect(() => {
    toast.success("Logged out successfully");
    router.replace("/login");
  });
  return <div>Loading...</div>;
};

export default Logout;
