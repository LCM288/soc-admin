import React, { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/react-hooks";
import AdminLayout from "layouts/adminLayout";
import toast from "utils/toast";
import { getMicrosoftLoginLink } from "utils/microsoftLogin";
import TextField from "components/fields/textField";
import { PreventDefaultForm } from "utils/domEventHelpers";

import { Button, Section, Container, Heading } from "react-bulma-components";
import initClientKeysMutation from "apollo/queries/socSetting/initClientKeys.gql";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const Authentication = (): React.ReactElement => {
  interface InitialiseClientSettings {
    clientId: string;
    clientSecret: string;
  }

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

  const formSubmit = useCallback(
    (settings: InitialiseClientSettings) => {
      initClientKeys({
        variables: {
          id: settings.clientId,
          secret: settings.clientSecret,
        },
      })
        .then((updateSocSettingPayload) => {
          if (!updateSocSettingPayload.data.initClientKeys.success) {
            throw new Error(
              updateSocSettingPayload.data.initClientKeys.message
            );
          }
          const link = getMicrosoftLoginLink({
            baseUrl: window.location.origin,
            clientId: settings.clientId,
          });
          router.push(link);
        })
        .catch((error) => {
          toast.danger(error.message, {
            position: toast.POSITION.TOP_LEFT,
          });
        });
    },
    [initClientKeys, router]
  );

  return (
    <div>
      <Section>
        <Container>
          <Heading>Authentication</Heading>
          <Heading subtitle renderAs="h2">
            Change authentication API key
          </Heading>
          <PreventDefaultForm
            onSubmit={() => formSubmit({ clientId, clientSecret })}
          >
            <>
              <TextField
                value={clientId}
                setValue={setClientId}
                label="Client ID"
                placeholder="Client ID"
                editable
                required
              />
              <TextField
                value={clientSecret}
                setValue={setClientSecret}
                label="Client Secret"
                placeholder="Client Secret"
                editable
                required
              />
              <Button color="primary" type="submit">
                Authenticate
              </Button>
            </>
          </PreventDefaultForm>
          {initClientKeysMutationLoading && <p>Loading...</p>}
          {initClientKeysMutationError && <p>Error :( Please try again</p>}
        </Container>
      </Section>
    </div>
  );
};

Authentication.Layout = AdminLayout;

export default Authentication;
