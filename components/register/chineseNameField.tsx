/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

interface Props {
  chineseName: string;
  setChineseName: (value: string) => void;
}

const ChineseNameField: React.FunctionComponent<Props> = ({
  chineseName,
  setChineseName,
}: Props) => {
  return (
    <Field>
      <Label>Chinese Name</Label>
      <Control>
        <Input
          placeholder="Chinese Name as in CU Link Card"
          value={chineseName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            setChineseName(event.target.value)
          }
        />
      </Control>
    </Field>
  );
};

export default ChineseNameField;
