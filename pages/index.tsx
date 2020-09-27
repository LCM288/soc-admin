import React from "react";
import { DateTime } from "luxon";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { Person } from "@/models/Person";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery } from "@apollo/react-hooks";
import { Button, Section, Container, Heading } from "react-bulma-components";
import query from "apollo/queries/executive/executives.gql";
import personQuery from "../apollo/queries/person/person.gql";

export const getServerSideProps: GetServerSideProps<{
  user: User | null;
}> = async (ctx) => {
  const user = await getUserAndRefreshToken(ctx);
  if (!user) {
    ctx.res.statusCode = 307;
    ctx.res.setHeader("Location", "/login");
  }
  return {
    props: { user }, // will be passed to the page component as props
  };
};

export default function Index({
  user,
}: {
  user: User | null;
}): React.ReactElement {
  const router = useRouter();
  const personQueryResult = useQuery(personQuery, {
    variables: { sid: user?.sid },
    fetchPolicy: "network-only",
  });
  const { data, loading, error } = useQuery(query, {
    variables: { sid: user?.sid ?? "" },
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
  // console.log(new DateTime());

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
            <div>{JSON.stringify(data)}</div>
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
