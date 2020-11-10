import React, { useState } from "react";
import toast from "utils/toast";

import { Button, Form } from "react-bulma-components";
import { User } from "@/types/datasources";
import { useMutation } from "@apollo/react-hooks";
import Link from "next/link";
import newExecutiveMutation from "../apollo/queries/executive/newExecutive.gql";

const { Input, Field, Control, Label } = Form;

interface Props {
  user: User;
}

const ExecutiveSetup: React.FunctionComponent<Props> = ({ user }: Props) => {
  const [
    newExecutive,
    { loading: newExecutiveMutationLoading, error: newExecutiveMutationError },
  ] = useMutation(newExecutiveMutation);

  const [nickname, setNickname] = useState("");
  const [position, setPosition] = useState("");

  const setExecutive = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!user) {
      toast.danger("User is not found", {
        position: toast.POSITION.TOP_LEFT,
      });
    } else {
      try {
        const newExecutivePayload = await newExecutive({
          variables: {
            sid: user.sid,
            nickname,
            pos: position,
          },
        });
        if (!newExecutivePayload.data.newExecutive.success) {
          throw new Error(newExecutivePayload.data.newExecutive.message);
        }
        window.location.reload();
      } catch (err) {
        toast.danger(err.message, {
          position: toast.POSITION.TOP_LEFT,
        });
      }
    }
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
          <Link href="/logout">
            <a href="/logout" className="button">
              Logout
            </a>
          </Link>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </Button.Group>
      </div>
      {newExecutiveMutationLoading && <p>Loading...</p>}
      {newExecutiveMutationError && <p>Error :( Please try again</p>}
    </form>
  );
};

export default ExecutiveSetup;
