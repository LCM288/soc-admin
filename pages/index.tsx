import React, { useState } from "react";
import { DateTime } from "luxon";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { User } from "@/types/datasources";
import { Person } from "@/models/Person";
import { getUserAndRefreshToken } from "utils/auth";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Form,
  Section,
  Container,
  Heading,
} from "react-bulma-components";
import query from "apollo/queries/executive/executives.gql";
import personQuery from "../apollo/queries/person/person.gql";
import socSettingsQuery from "../apollo/queries/socSetting/socSettings.gql";
import newExecutiveMutation from "../apollo/queries/executive/newExecutive.gql";
import updateSocSettingMutation from "../apollo/queries/socSetting/updateSocSetting.gql";

const { Input, Field, Control, Label } = Form;

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
  const socSettingsQueryResult = useQuery(socSettingsQuery, {
    fetchPolicy: "network-only",
  });
  const { data, loading, error } = useQuery(query, {
    variables: { sid: user?.sid ?? "" },
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
  const [hasExecutiveForm, setHasExecutiveForm] = useState(false);
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
  const executiveForm = () => {
    if (hasExecutiveForm) {
      return (
        <form onSubmit={(e) => setExecutive(e)}>
          <Field>
            <Label>Nickname</Label>
            <Control>
              <Input
                value={nickname}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setNickname(event.target.value)
                }
                required
              />
            </Control>
          </Field>
          <Field>
            <Label>Position</Label>
            <Control>
              <Input
                value={position}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setPosition(event.target.value)
                }
                required
              />
            </Control>
          </Field>
          <Button color="primary" type="submit">
            Submit
          </Button>
          {(newExecutiveMutationLoading || updateSocSettingMutationLoading) && (
            <p>Loading...</p>
          )}
          {(newExecutiveMutationError || updateSocSettingMutationError) && (
            <p>Error :( Please try again</p>
          )}
        </form>
      );
    }
    return (
      <Button color="primary" onClick={() => setHasExecutiveForm(true)}>
        Set myself as executive
      </Button>
    );
  };

  if (personQueryResult.loading || socSettingsQueryResult.loading || loading)
    return <p>loading</p>;
  if (personQueryResult.error || socSettingsQueryResult.error || error)
    return <p>ERROR</p>;

  if (
    !socSettingsQueryResult.data.socSettings.find(
      (s: { key: string; value: string }) => s.key === "created_at"
    ) &&
    user
  ) {
    return (
      <div>
        <Section>
          <Container>
            <Heading>This SocAdmin system is not initialised.</Heading>
            <div>
              {getGreetingTime()}, {user.name}
            </div>
            <Button onClick={logout}>logout</Button>
            {executiveForm()}
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
