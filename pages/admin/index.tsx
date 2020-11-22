import React, { useMemo, useEffect } from "react";
import { DateTime } from "luxon";
import AdminLayout from "layouts/adminLayout";
import { useQuery } from "@apollo/react-hooks";
import { Heading } from "react-bulma-components";
import {
  PersonModelAttributes,
  statusOf,
  MemberStatusEnum,
} from "@/utils/Person";
import Link from "next/link";
import IndexWrapper from "components/indexWrapper";
import { ServerSideProps } from "utils/getServerSideProps";
import ReactMarkdown from "react-markdown/with-html";
import {
  SOC_NAME,
  WELCOME_MESSAGE,
  NON_REGISTERED_MESSAGE,
  ACTIVATED_MESSAGE,
  UNACTIVATED_MESSAGE,
  EXPIRED_MESSAGE,
} from "utils/socSettings";
import toast from "utils/toast";
import personQuery from "apollo/queries/person/person.gql";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const Index = ({ user }: ServerSideProps): React.ReactElement => {
  const personQueryResult = useQuery(personQuery, {
    variables: { sid: user?.sid },
    fetchPolicy: "network-only",
  });

  const socSettingsQueryResult = useQuery(socSettingsQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (personQueryResult.error) {
      toast.danger(personQueryResult.error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [personQueryResult.error]);

  useEffect(() => {
    if (socSettingsQueryResult.error) {
      toast.danger(socSettingsQueryResult.error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [socSettingsQueryResult.error]);

  const greeting = useMemo(() => {
    // ref: https://gist.github.com/James1x0/8443042

    const splitMoring = 5; // 24hr time to split the afternoon
    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const currentHour = DateTime.local().hour;

    const userName = user?.name ?? "";

    if (splitAfternoon <= currentHour && currentHour <= splitEvening) {
      return `Good afternoon, ${userName}`;
    }
    if (currentHour <= splitMoring || splitEvening <= currentHour) {
      return `Good evening, ${userName}`;
    }
    return `Good morning, ${userName}`;
  }, [user]);

  const memberStatus = useMemo(() => {
    const person = (personQueryResult.data?.person ||
      null) as PersonModelAttributes | null;
    if (!person) {
      return "Non-registered";
    }
    return statusOf(person);
  }, [personQueryResult.data]);

  const customMessage = useMemo(() => {
    let messageKey: string;
    switch (memberStatus) {
      case MemberStatusEnum.Activated:
        messageKey = ACTIVATED_MESSAGE.key;
        break;
      case MemberStatusEnum.Unactivated:
        messageKey = UNACTIVATED_MESSAGE.key;
        break;
      case MemberStatusEnum.Expired:
        messageKey = EXPIRED_MESSAGE.key;
        break;
      default:
        messageKey = NON_REGISTERED_MESSAGE.key;
        break;
    }
    return socSettingsQueryResult.data?.socSettings.find(
      (socSetting: { key: string; value: string }) =>
        socSetting.key === messageKey
    )?.value;
  }, [memberStatus, socSettingsQueryResult.data]);

  const welcomeMessage = useMemo(
    () =>
      socSettingsQueryResult.data?.socSettings.find(
        (s: { key: string; value: string }) => s.key === WELCOME_MESSAGE.key
      )?.value,
    [socSettingsQueryResult.data?.socSettings]
  );

  const socName = useMemo(
    () =>
      socSettingsQueryResult.data?.socSettings.find(
        (s: { key: string; value: string }) => s.key === SOC_NAME.key
      )?.value,
    [socSettingsQueryResult.data?.socSettings]
  );

  const isLoading = useMemo(
    () => personQueryResult.loading || socSettingsQueryResult.loading,
    [personQueryResult.loading, socSettingsQueryResult.loading]
  );

  if (user) {
    return (
      <IndexWrapper>
        <>
          {isLoading && <Heading className="p-5 mb-0">Loading...</Heading>}
          {socName && <Heading className="p-5 mb-0">{socName}</Heading>}
          <div className="mb-5">{greeting}</div>
          {welcomeMessage && (
            <div className="mb-5">
              <ReactMarkdown source={welcomeMessage} escapeHtml={false} />
            </div>
          )}
          {customMessage && (
            <div className="mb-5">
              <ReactMarkdown source={customMessage} escapeHtml={false} />
            </div>
          )}

          <Link href="/member">
            <a href="/member" className="button is-warning">
              Member Page
            </a>
          </Link>
        </>
      </IndexWrapper>
    );
  }
  return <></>;
};

Index.Layout = AdminLayout;

export default Index;
