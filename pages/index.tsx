import React from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { Person } from "@/models/Person";
import { useQuery } from "@apollo/react-hooks";
import { Button, Section, Container, Heading } from "react-bulma-components";
import { ServerSideProps } from "utils/getServerSideProps";
import ReactMarkdown from "react-markdown/with-html";
import toast from "utils/toast";
import executiveQuery from "apollo/queries/executive/executive.gql";
import ExecutiveSetup from "components/executiveSetup";
import { SOC_NAME, WELCOME_MESSAGE, INACTIVE_MESSAGE } from "utils/socSettings";
import personQuery from "../apollo/queries/person/person.gql";
import countExecutivesQuery from "../apollo/queries/executive/countExecutives.gql";
import socSettingsQuery from "../apollo/queries/socSetting/socSettings.gql";

export { getServerSideProps } from "utils/getServerSideProps";

export default function Index({ user }: ServerSideProps): React.ReactElement {
  const router = useRouter();
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
  const executiveQueryResult = useQuery(executiveQuery, {
    variables: { sid: user?.sid },
  });

  const logout = () => {
    router.push("/api/logout");
  };
  const register = () => {
    router.push("/register");
  };
  const isActiveMember = (person: Person) => {
    if (!person.memberSince) return false;
    if (!person.memberUntil) {
      return DateTime.fromISO(person.expectedGraduationDate) > DateTime.local();
    }
    return DateTime.fromISO(person.memberUntil) > DateTime.local();
  };

  const memberStatus = (person: Person | null) => {
    // TODO: get strings from socSetting for payment methods
    if (!person) {
      return (
        <div>
          <p>You have not registered</p>
          <ReactMarkdown
            source={
              socSettingsQueryResult.data.socSettings.find(
                (s: { key: string; value: string }) =>
                  s.key === WELCOME_MESSAGE.key
              )?.value
            }
            escapeHtml={false}
          />
        </div>
      );
    }
    if (isActiveMember(person)) {
      return <div> You are a member </div>;
    }
    return (
      <div>
        <p> You are not active member </p>
        <ReactMarkdown
          source={
            socSettingsQueryResult.data.socSettings.find(
              (s: { key: string; value: string }) =>
                s.key === INACTIVE_MESSAGE.key
            )?.value
          }
          escapeHtml={false}
        />
      </div>
    );
  };
  const getGreetingTime = () => {
    // ref: https://gist.github.com/James1x0/8443042
    let g = null; // return g

    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const currentHour = DateTime.local().hour;

    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
      g = "Good afternoon";
    } else if (currentHour >= splitEvening) {
      g = "Good evening";
    } else {
      g = "Good morning";
    }

    return g;
  };

  if (executiveQueryResult.data?.executive) {
    router.replace("/admin");
    return <></>;
  }

  if (
    countExecutivesQueryResult.loading ||
    personQueryResult.loading ||
    socSettingsQueryResult.loading ||
    executiveQueryResult.loading
  )
    return <p>loading</p>;
  if (
    countExecutivesQueryResult.error ||
    personQueryResult.error ||
    socSettingsQueryResult.error ||
    executiveQueryResult.error
  ) {
    const error =
      countExecutivesQueryResult.error ||
      personQueryResult.error ||
      socSettingsQueryResult.error ||
      executiveQueryResult.error;
    toast.danger(error?.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }
  console.log(socSettingsQueryResult);
  if (!countExecutivesQueryResult.data.countExecutives && user) {
    return (
      <div>
        <Section>
          <Container>
            <Heading>Set youself as an executive.</Heading>
            <div>
              {getGreetingTime()}, {user.name}
            </div>
            <ExecutiveSetup user={user} />
          </Container>
        </Section>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <Section>
          <Container>
            <Heading>
              {
                socSettingsQueryResult.data.socSettings.find(
                  (s: { key: string; value: string }) => s.key === SOC_NAME.key
                )?.value
              }
            </Heading>
            <Heading>
              {personQueryResult.data ? "Welcome Back" : "Hello"}
            </Heading>
            <p>
              {getGreetingTime()}, {user.name}
            </p>
            {memberStatus(personQueryResult.data.person)}
            <Button.Group>
              <Button onClick={logout}>logout</Button>
              <Button color="primary" onClick={register}>
                register
              </Button>
            </Button.Group>
          </Container>
        </Section>
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
}
