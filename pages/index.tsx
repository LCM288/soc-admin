import React, { useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { Person } from "@/models/Person";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Section,
  Container,
  Form,
  Heading,
} from "react-bulma-components";
import { ServerSideProps } from "utils/getServerSideProps";
import executiveQuery from "apollo/queries/executive/executive.gql";
import personQuery from "../apollo/queries/person/person.gql";
import countExecutivesQuery from "../apollo/queries/executive/countExecutives.gql";
import socSettingsQuery from "../apollo/queries/socSetting/socSettings.gql";
import newExecutiveMutation from "../apollo/queries/executive/newExecutive.gql";
import updateSocSettingMutation from "../apollo/queries/socSetting/updateSocSetting.gql";

const { Input, Field, Control, Label } = Form;

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
  const { data, loading, error } = useQuery(executiveQuery, {
    variables: { sid: user?.sid },
  });
  const [
    newExecutive,
    { loading: newExecutiveMutationLoading, error: newExecutiveMutationError },
  ] = useMutation(newExecutiveMutation);
  const [
    updateSocSetting,
    {
      loading: updateSocSettingMutationLoading,
      error: updateSocSettingMutationError,
    },
  ] = useMutation(updateSocSettingMutation);
  const [nickname, setNickname] = useState("");
  const [position, setPosition] = useState("");

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
    return <div> You are not active member </div>;
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
  const setExecutive = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    newExecutive({
      variables: {
        sid: user?.sid,
        nickname,
        pos: position,
      },
    });
    updateSocSetting({
      variables: {
        key: "created_at",
        value: DateTime.utc().toISO(),
      },
    });
    // TODO: redirect to admin page
    // router.push("/");
    window.location.reload();
  };

  if (data?.executive) {
    router.replace("/admin");
    return <></>;
  }

  if (
    countExecutivesQueryResult.loading ||
    personQueryResult.loading ||
    socSettingsQueryResult.loading ||
    loading
  )
    return <p>loading</p>;
  if (
    countExecutivesQueryResult.error ||
    personQueryResult.error ||
    socSettingsQueryResult.error ||
    error
  )
    return <p>ERROR</p>;

  if (!countExecutivesQueryResult.data.countExecutives && user) {
    return (
      <div>
        <Section>
          <Container>
            <Heading>Set youself as an executive.</Heading>
            <div>
              {getGreetingTime()}, {user.name}
            </div>
            <form onSubmit={(e) => setExecutive(e)}>
              <Field>
                <Label>Nickname</Label>
                <Control>
                  <Input
                    value={nickname}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setNickname(event.target.value)}
                    required
                  />
                </Control>
              </Field>
              <Field>
                <Label>Position</Label>
                <Control>
                  <Input
                    value={position}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setPosition(event.target.value)}
                    required
                  />
                </Control>
              </Field>
              <div>
                <Button.Group>
                  <Button onClick={logout}>logout</Button>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </Button.Group>
              </div>
              {(newExecutiveMutationLoading ||
                updateSocSettingMutationLoading) && <p>Loading...</p>}
              {(newExecutiveMutationError || updateSocSettingMutationError) && (
                <p>Error :( Please try again</p>
              )}
            </form>
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
              {personQueryResult.data ? "Welcome Back" : "Hello"}
            </Heading>
            <p>
              {getGreetingTime()}, {user.name}
            </p>
            <p>{memberStatus(personQueryResult.data.person)}</p>
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
