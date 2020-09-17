import React, { useEffect } from "react";
import qs from "qs";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { host } = ctx.req.headers;
  const protocol = /^localhost/g.test(host) ? "http" : "https";
  const baseUrl = `${protocol}://${ctx.req.headers.host}`;
  const { __jwt: token } = parseCookies(ctx);
  const user: User = jwt.decode(token);
  return {
    props: {
      baseUrl,
      user,
    },
  };
};

function MicrosoftLogin({
  baseUrl,
  user,
}: {
  baseUrl: string;
  user: User;
}): React.ReactElement {
  useEffect(() => {
    if (user) {
      Router.push("/");
    }
  });
  /* TODO put CLIENT_ID to database */
  const TENANT = "link.cuhk.edu.hk";
  const CLIENT_ID = "373b4ec9-6336-4955-90cf-b7cbd9e3426f";
  const REDIRECT_URI = `${baseUrl}/api/login`;

  const body = qs.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "user.read",
    redirect_uri: REDIRECT_URI,
    response_mode: "form_post",
    prompt: "select_account",
    domain_hint: TENANT,
  });

  const link = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize?${body}`;
  return <a href={link}>login</a>;
}

export default MicrosoftLogin;
