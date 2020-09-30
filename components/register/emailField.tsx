/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

interface Props {
  email: string;
  setEmail: (value: string) => void;
}

const EmailField: React.FunctionComponent<Props> = ({
  email,
  setEmail,
}: Props) => {
  return (
    <Field>
      <Label>Email</Label>
      <Control>
        <Input
          type="email"
          placeholder="Text input"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            setEmail(event.target.value)
          }
        />
      </Control>
    </Field>
  );
};

export default EmailField;
