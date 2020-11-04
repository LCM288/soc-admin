import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

interface Props {
  sid: string;
  setSID?: (value: string) => void;
  editable?: boolean;
}

const SIDField: React.FunctionComponent<Props> = ({
  sid,
  setSID = () => {},
  editable = false,
}: Props) => {
  return (
    <Field>
      <Label>Student ID</Label>
      <Control>
        <Input
          type="number"
          value={sid}
          disabled={!editable}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setSID(event.target.value);
          }}
          required
        />
      </Control>
    </Field>
  );
};

SIDField.defaultProps = {
  setSID: () => {},
  editable: false,
};

export default SIDField;
