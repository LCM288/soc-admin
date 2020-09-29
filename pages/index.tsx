import React from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { Person } from "@/models/Person";
import { useQuery } from "@apollo/react-hooks";
import { Button, Section, Container, Heading } from "react-bulma-components";
import { ServerSideProps } from "utils/getServerSideProps";
import executiveQuery from "apollo/queries/executive/executive.gql";
import personQuery from "../apollo/queries/person/person.gql";

export { getServerSideProps } from "utils/getServerSideProps";

export default function Index({ user }: ServerSideProps): React.ReactElement {
  const router = useRouter();
  const personQueryResult = useQuery(personQuery, {
    variables: { sid: user?.sid },
    fetchPolicy: "network-only",
  });
  const { data, loading, error } = useQuery(executiveQuery, {
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
      return <div> You have not registered </div>;
    }
    if (isActiveMember(person)) {
      return <div> You are a member </div>;
    }
    return <div> You are not a member </div>;
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
  if (personQueryResult.loading || loading) return <p>loading</p>;
  if (personQueryResult.error || error) return <p>ERROR</p>;

  if (data?.executive) {
    router.replace("/admin");
    return <></>;
  }

  if (user) {
    return (
      <div>
        <Section>
          <Container>
            <Heading>
              {personQueryResult.data ? "Welcome Back" : "Hello"}
            </Heading>
            <div>
              {getGreetingTime()}, {user.name}
            </div>
            {memberStatus(personQueryResult.data.person)}
            <Button onClick={logout}>logout</Button>
            <Button color="primary" onClick={register}>
              register
            </Button>
          </Container>
        </Section>
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
}
