import React from "react";
import qs from "qs";
import { GetServerSideProps } from "next";
import { getUser } from "../apollo/server/utils";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { host } = ctx.req.headers;
  const protocol = /^localhost/g.test(host) ? "http" : "https";
  const baseUrl = `${protocol}://${ctx.req.headers.host}`;
  const user = await getUser(ctx);
  if (user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/");
  }
  return {
    props: {
      baseUrl,
    },
  };
};

function MicrosoftLogin({ baseUrl }: { baseUrl: string }): React.ReactElement {
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
