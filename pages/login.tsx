import React from "react";
import qs from "qs";
import { GetServerSideProps } from "next";
import { getUserAndRefreshToken, getSetting, CLIENT_ID_KEY } from "utils/auth";

const EMPTY_PROPS = {
  props: { baseUrl: "", clientId: "" },
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUserAndRefreshToken(ctx);
  if (user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/");
    return EMPTY_PROPS;
  }
  const { host = "" } = ctx.req.headers;
  const protocol = /^localhost/g.test(host) ? "http" : "https";
  const baseUrl = `${protocol}://${ctx.req.headers.host}`;
  const clientId = await getSetting(CLIENT_ID_KEY);
  if (!clientId) {
    ctx.res.statusCode = 500;
    ctx.res.end("Cannot get client id");
    return EMPTY_PROPS;
  }
  return {
    props: {
      baseUrl,
      clientId,
    },
  };
};

function MicrosoftLogin({
  baseUrl,
  clientId,
}: {
  baseUrl: string;
  clientId: string;
}): React.ReactElement {
  const TENANT = "link.cuhk.edu.hk";
  const redirectUrl = `${baseUrl}/api/login`;

  const body = qs.stringify({
    client_id: clientId,
    response_type: "code",
    scope: "user.read",
    redirect_uri: redirectUrl,
    response_mode: "form_post",
    prompt: "select_account",
    domain_hint: TENANT,
  });

  const link = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize?${body}`;
  return <a href={link}>login</a>;
}

export default MicrosoftLogin;
