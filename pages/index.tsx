import React, { useMemo, useEffect } from "react";
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
import IndexWrapper from "components/indexWrapper";
import { getMicrosoftLoginLink } from "utils/microsoftLogin";
import { DateTime } from "luxon";
import ReactMarkdown from "react-markdown/with-html";
import toast from "utils/toast";
import { useQuery } from "@apollo/react-hooks";
import { SOC_NAME, WELCOME_MESSAGE } from "utils/socSettings";
import { Heading, Button } from "react-bulma-components";

import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";

interface Props {
  baseUrl: string;
  clientId: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
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

function Index({ baseUrl, clientId }: Props): React.ReactElement {
  const { data, error, loading } = useQuery(socSettingsQuery, {
    fetchPolicy: "network-only",
  });

  const link = useMemo(() => getMicrosoftLoginLink({ baseUrl, clientId }), [
    baseUrl,
    clientId,
  ]);

  const welcomeMessage = useMemo(
    () =>
      data?.socSettings.find(
        (s: { key: string; value: string }) => s.key === WELCOME_MESSAGE.key
      )?.value,
    [data?.socSettings]
  );

  const socName = useMemo(
    () =>
      data?.socSettings.find(
        (s: { key: string; value: string }) => s.key === SOC_NAME.key
      )?.value,
    [data?.socSettings]
  );

  useEffect(() => {
    if (error) {
      toast.danger(error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [error]);

  return (
    <IndexWrapper>
      <>
        {loading && <Heading className="p-5 mb-0">Loading...</Heading>}
        {socName && <Heading className="p-5 mb-0">{socName}</Heading>}
        {welcomeMessage && (
          <div className="mb-5">
            <ReactMarkdown source={welcomeMessage} escapeHtml={false} />
          </div>
        )}
        <Button color="primary" href={link} size="medium" renderAs="a">
          Login with CUHK OnePass
        </Button>
      </>
    </IndexWrapper>
  );
}

export default Index;
