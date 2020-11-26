import React, { useState, useCallback } from "react";
import toast from "utils/toast";

import { Button } from "react-bulma-components";
import { User } from "@/types/datasources";
import { useMutation } from "@apollo/react-hooks";
import Link from "next/link";
import { ExecutiveCreationAttributes } from "@/models/Executive";
import { PreventDefaultForm } from "utils/domEventHelpers";
import TextField from "components/fields/textField";
import newExecutiveMutation from "../apollo/queries/executive/newExecutive.gql";

interface Props {
  user: User;
}

const ExecutiveSetup = ({ user }: Props): React.ReactElement => {
  const [
    newExecutive,
    { loading: newExecutiveMutationLoading, error: newExecutiveMutationError },
  ] = useMutation(newExecutiveMutation);

  const [nickname, setNickname] = useState("");
  const [pos, setPos] = useState("");

  const setExecutive = useCallback(
    (person: ExecutiveCreationAttributes) => {
      newExecutive({
        variables: person,
      })
        .then((newExecutivePayload) => {
          if (!newExecutivePayload.data.newExecutive.success) {
            throw new Error(newExecutivePayload.data.newExecutive.message);
          }
          window.location.reload();
        })
        .catch((error) => {
          toast.danger(error.message, {
            position: toast.POSITION.TOP_LEFT,
          });
        });
    },
    [newExecutive]
  );

  return (
    <PreventDefaultForm
      onSubmit={() =>
        setExecutive({
          sid: user.sid,
          nickname,
          pos,
        })
      }
    >
      <div style={{ textAlign: "initial" }}>
        <TextField
          value={nickname}
          setValue={setNickname}
          label="Nickname"
          placeholder="Nickname"
          editable
        />
        <TextField
          value={pos}
          setValue={setPos}
          label="Position"
          placeholder="Position"
          editable
        />
        <Button.Group>
          <Link href="/logout">
            <a href="/logout" className="button">
              Logout
            </a>
          </Link>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Button.Group>
        {newExecutiveMutationLoading && <p>Loading...</p>}
        {newExecutiveMutationError && <p>Error :( Please try again</p>}
      </div>
    </PreventDefaultForm>
  );
};

export default ExecutiveSetup;
