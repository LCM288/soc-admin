/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Form } from "react-bulma-components";

const { Input, Field, Control, Label } = Form;

interface Props {
  englishName: string;
  setEnglishName?: (value: string) => void;
  isAdmin: boolean;
}

const EnglishNameField: React.FunctionComponent<Props> = ({
  englishName,
  setEnglishName = () => {},
  isAdmin = false,
}: Props) => {
  return (
    <Field>
      <Label>English Name</Label>
      <Control>
        <Input
          placeholder="English Name as in CU Link Card"
          value={englishName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            setEnglishName(event.target.value)
          }
          disabled={!isAdmin}
          required
        />
      </Control>
    </Field>
  );
};

EnglishNameField.defaultProps = {
  setEnglishName: () => {},
};

export default EnglishNameField;
