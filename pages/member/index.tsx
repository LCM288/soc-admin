import React, { useMemo, useEffect } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import {
  PersonModelAttributes,
  statusOf,
  MemberStatusEnum,
} from "@/utils/Person";
import { useQuery } from "@apollo/react-hooks";
import { Button, Section, Container, Heading } from "react-bulma-components";
import { ServerSideProps } from "utils/getServerSideProps";
import ReactMarkdown from "react-markdown/with-html";
import toast from "utils/toast";
import ExecutiveSetup from "components/executiveSetup";
import MemberLayout from "layouts/memberLayout";
import {
  SOC_NAME,
  WELCOME_MESSAGE,
  NON_REGISTERED_MESSAGE,
  ACTIVATED_MESSAGE,
  UNACTIVATED_MESSAGE,
  EXPIRED_MESSAGE,
} from "utils/socSettings";
import personQuery from "apollo/queries/person/person.gql";
import countExecutivesQuery from "apollo/queries/executive/countExecutives.gql";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";

export { getMemberPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const Index = ({ user, isAdmin }: ServerSideProps): React.ReactElement => {
  const personQueryResult = useQuery(personQuery, {
    variables: { sid: user?.sid },
    fetchPolicy: "network-only",
  });
  const socSettingsQueryResult = useQuery(socSettingsQuery, {
    fetchPolicy: "network-only",
  });
  const countExecutivesQueryResult = useQuery(countExecutivesQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (countExecutivesQueryResult.error) {
      toast.danger(countExecutivesQueryResult.error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [countExecutivesQueryResult.error]);

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

  const registerButtonText = useMemo(() => {
    switch (memberStatus) {
      case MemberStatusEnum.Activated:
        return "";
      case MemberStatusEnum.Expired:
        return "Renew";
      default:
        return "Register";
    }
  }, [memberStatus]);

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
    () =>
      countExecutivesQueryResult.loading ||
      personQueryResult.loading ||
      socSettingsQueryResult.loading,
    [
      countExecutivesQueryResult.loading,
      personQueryResult.loading,
      socSettingsQueryResult.loading,
    ]
  );

  if (!user) {
    return <></>;
  }

  if (countExecutivesQueryResult.data?.countExecutives === 0) {
    return (
      <div>
        <Section>
          <Container>
            <Heading>Set youself as an executive.</Heading>
            <div>{greeting}</div>
            <ExecutiveSetup user={user} />
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <Section>
        <Container>
          {isLoading && <Heading>Loading...</Heading>}
          {socName && <Heading>{socName}</Heading>}
          <div className="mb-2">{greeting}</div>
          {welcomeMessage && (
            <div className="mb-2">
              <ReactMarkdown source={welcomeMessage} escapeHtml={false} />
            </div>
          )}
          {customMessage && (
            <div className="mb-2">
              <ReactMarkdown source={customMessage} escapeHtml={false} />
            </div>
          )}
          <Button.Group>
            {registerButtonText && (
              <Link href="/member/register">
                <a href="/member/register" className="button is-primary">
                  {registerButtonText}
                </a>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin">
                <a href="/admin" className="button is-info">
                  Admin Portal
                </a>
              </Link>
            )}
          </Button.Group>
        </Container>
      </Section>
    </div>
  );
};

Index.Layout = MemberLayout;

export default Index;
