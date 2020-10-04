import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/react-hooks";
import toast from "utils/toast";
import { getMicrosoftLoginLink } from "utils/microsoftLogin";

import {
  Button,
  Form,
  Section,
  Container,
  Heading,
} from "react-bulma-components";
import initClientKeysMutation from "../apollo/queries/socSetting/initClientKeys.gql";

const { Input, Field, Control, Label } = Form;

export default function Initialise(): React.ReactElement {
  const router = useRouter();
  const [
    initClientKeys,
    {
      loading: initClientKeysMutationLoading,
      error: initClientKeysMutationError,
    },
  ] = useMutation(initClientKeysMutation);

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const formSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const updateSocSettingPayload = await initClientKeys({
        variables: {
          id: clientId,
          secret: clientSecret,
        },
      });
      if (!updateSocSettingPayload.data.initClientKeys.success) {
        throw new Error(updateSocSettingPayload.data.initClientKeys.message);
      }
      const link = getMicrosoftLoginLink({
        baseUrl: window.location.origin,
        clientId,
      });
      router.push(link);
    } catch (err) {
      toast.danger(err.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
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
          {initClientKeysMutationLoading && <p>Loading...</p>}
          {initClientKeysMutationError && <p>Error :( Please try again</p>}
        </Container>
      </Section>
    </div>
  );
}
