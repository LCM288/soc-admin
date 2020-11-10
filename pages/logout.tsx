import React from "react";
import { GetServerSideProps } from "next";
import { setJwtHeader } from "utils/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  setJwtHeader("", ctx.res);
  return { redirect: { permanent: false, destination: "/" } };
};

export default (): React.ReactElement => <></>;
