import React from "react";
import { GetServerSideProps } from "next";
import { setJwtHeader } from "utils/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  setJwtHeader("", ctx.res);
  ctx.res.statusCode = 307;
  ctx.res.setHeader("Location", "/");
  return { props: {} };
};

export default (): React.ReactElement => <></>;
