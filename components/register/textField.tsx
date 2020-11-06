/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

interface Props {
  value: string;
  setValue?: (value: string) => void;
  label: string;
  placeholder?: string;
  editable?: boolean;
}

const TextField: React.FunctionComponent<Props> = ({
  value,
  setValue = () => {},
  label,
  placeholder = "",
  editable = false,
}: Props) => {
  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            setValue(event.target.value)
          }
          disabled={!editable}
          required
        />
      </Control>
    </Field>
  );
};

TextField.defaultProps = {
  placeholder: "",
  setValue: () => {},
  editable: false,
};

export default TextField;
