import React, { useState } from "react";
import { useRouter } from "next/router";

import {
  Button,
  Section,
  Container,
  Form,
  Heading,
} from "react-bulma-components";
import { DateTime, Info } from "luxon";
import { User } from "@/types/datasources";
import { useQuery, useMutation } from "@apollo/react-hooks";
import newExecutiveMutation from "../apollo/queries/executive/newExecutive.gql";
import updateSocSettingMutation from "../apollo/queries/socSetting/updateSocSetting.gql";

const { Input, Field, Control, Label } = Form;

interface Props {
  user: User;
}

const ExecutiveSetup: React.FunctionComponent<Props> = ({ user }: Props) => {
  const router = useRouter();

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

  const setExecutive = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!user) {
      // TODO: toast
    } else {
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
      window.location.reload();
    }
  };

  const logout = () => {
    router.push("/api/logout");
  };

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
      <div>
        <Button.Group>
          <Button onClick={logout}>logout</Button>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Button.Group>
      </div>
      {(newExecutiveMutationLoading || updateSocSettingMutationLoading) && (
        <p>Loading...</p>
      )}
      {(newExecutiveMutationError || updateSocSettingMutationError) && (
        <p>Error :( Please try again</p>
      )}
    </form>
  );
};

export default ExecutiveSetup;
