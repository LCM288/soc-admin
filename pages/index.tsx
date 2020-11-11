import React from "react";
import { GetServerSideProps } from "next";
import {
  isAdmin,
  getUserAndRefreshToken,
  getSetting,
  getSettingWithTime,
  countExecutives,
  deleteNewAPIKey,
  NEW_CLIENT_ID_KEY,
  CLIENT_ID_KEY,
} from "utils/auth";
import { getMicrosoftLoginLink } from "utils/microsoftLogin";
import { DateTime } from "luxon";

import { Section, Container } from "react-bulma-components";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUserAndRefreshToken(ctx);
  if (user) {
    if (await isAdmin(user)) {
      ctx.res.statusCode = 307;
      ctx.res.setHeader("Location", "/admin");
      return { props: { baseUrl: "", clientId: "" } };
    }
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/member");
    return { props: { baseUrl: "", clientId: "" } };
  }
  const { host = "" } = ctx.req.headers;
  const protocol = /^localhost/g.test(host) ? "http" : "https";
  const baseUrl = `${protocol}://${ctx.req.headers.host}`;
  const newClientId = await getSettingWithTime(NEW_CLIENT_ID_KEY);
  const clientId = await getSetting(CLIENT_ID_KEY);
  const executives = await countExecutives();
  if (!executives) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/initialise");
    return { props: { baseUrl: "", clientId: "" } };
  }
  if (newClientId.value && newClientId.updatedAt) {
    if (
      DateTime.fromJSDate(newClientId.updatedAt).plus({ minutes: 5 }) >=
      DateTime.local()
    ) {
      return {
        props: {
          baseUrl,
          clientId: newClientId.value,
        },
      };
    }
    deleteNewAPIKey();
  }
  if (!clientId) {
    ctx.res.statusCode = 503;
    ctx.res.end("503 Cannot get client id");
    return { props: { baseUrl: "", clientId: "" } };
  }
  return {
    props: {
      baseUrl,
      clientId,
    },
  };
};

function Index({
  baseUrl,
  clientId,
}: {
  baseUrl: string;
  clientId: string;
}): React.ReactElement {
  const link = getMicrosoftLoginLink({ baseUrl, clientId });
  return (
    <div>
      <Section>
        <Container>
          <a className="button is-primary" href={link}>
            login
          </a>
        </Container>
      </Section>
    </div>
  );
}

export default Index;
