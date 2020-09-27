import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/react-hooks";
import {
  Button,
  Form,
  Section,
  Container,
  Heading,
} from "react-bulma-components";
import updateSocSettingMutation from "../apollo/queries/socSetting/updateSocSetting.gql";

export const CLIENT_ID_KEY = "client_id";
export const CLIENT_SECRET_KEY = "client_secret";

const { Input, Field, Control, Label } = Form;

export default function Initialise(): React.ReactElement {
  const router = useRouter();
  const [
    updateSocSetting,
    {
      loading: updateSocSettingMutationLoading,
      error: updateSocSettingMutationError,
    },
  ] = useMutation(updateSocSettingMutation);

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const formSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    updateSocSetting({
      variables: {
        key: CLIENT_ID_KEY,
        value: clientId,
      },
    });
    updateSocSetting({
      variables: {
        key: CLIENT_SECRET_KEY,
        value: clientSecret,
      },
    });
    router.push("/login");
  };

  return (
    <div>
      <Section>
        <Container>
          <Heading>Initialise</Heading>
          <form onSubmit={(e) => formSubmit(e)}>
            <Field>
              <Label>Client ID</Label>
              <Control>
                <Input
                  value={clientId}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setClientId(event.target.value)}
                />
              </Control>
            </Field>
            <Field>
              <Label>Client Secret</Label>
              <Control>
                <Input
                  value={clientSecret}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setClientSecret(event.target.value)}
                />
              </Control>
            </Field>
            <Button color="primary" type="submit">
              Initialise
            </Button>
          </form>
          {updateSocSettingMutationLoading && <p>Loading...</p>}
          {updateSocSettingMutationError && <p>Error :( Please try again</p>}
        </Container>
      </Section>
    </div>
  );
}
