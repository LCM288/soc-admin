import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

const SIDField: React.FunctionComponent<{
  sid: string;
}> = ({ sid }: { sid: string }) => {
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
