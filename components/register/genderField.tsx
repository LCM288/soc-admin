/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Form } from "react-bulma-components";
import ReactSelect from "react-select";

const { Field, Control, Label } = Form;

interface Props {
  gender: string;
  setGender: (value: string) => void;
}

const genders = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "None",
    label: "Prefer not to say",
  },
];

const None = genders.find((g) => g.value === "None");

const GenderField: React.FunctionComponent<Props> = ({
  gender,
  setGender,
}: Props) => {
  return (
    <Field>
      <Label>Gender</Label>
      <Control>
        <div>
          <ReactSelect
            defaultValue={None}
            value={genders.find((g) => g.value === gender)}
            options={genders}
            onChange={(input: { value: string }): void => {
              setGender(input.value);
            }}
          />
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{ position: "absolute", opacity: 0, height: 0 }}
            value={gender}
            onChange={() => {}}
            required
          />
        </div>
      </Control>
    </Field>
  );
};

export default GenderField;
