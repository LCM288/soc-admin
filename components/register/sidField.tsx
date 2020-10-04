import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

interface Props {
  sid: string;
}

const SIDField: React.FunctionComponent<Props> = ({ sid }: Props) => {
  return (
    <Field>
      <Label>Student ID</Label>
      <Control>
        <Input type="number" value={sid} disabled required />
      </Control>
    </Field>
  );
};

export default SIDField;
