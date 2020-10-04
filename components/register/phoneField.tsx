/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

interface Props {
  phone: string;
  setPhone: (value: string) => void;
}

const PhoneField: React.FunctionComponent<Props> = ({
  phone,
  setPhone,
}: Props) => {
  return (
    <Field>
      <Label>Phone Number</Label>
      <Control>
        {/* TODO: improve tel pattern */}
        <Input
          type="tel"
          value={phone}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            setPhone(event.target.value)
          }
          pattern="(?:\+[0-9]{2,3}-[0-9]{1,15})|(?:[0-9]{8})"
        />
      </Control>
    </Field>
  );
};

export default PhoneField;
