import React, { useMemo, useCallback } from "react";
import SelectField from "components/fields/selectField";

interface Props {
  gender: string;
  setGender: (value: string) => void;
}

const GenderField: React.FunctionComponent<Props> = ({
  gender,
  setGender,
}: Props) => {
  interface GenderOption {
    value: string;
    label: string;
  }

  const defaultOption = useMemo(
    () => ({
      value: "None",
      label: "Prefer not to say",
    }),
    []
  );

  const genderOptions: GenderOption[] = useMemo(
    () => [
      {
        value: "Male",
        label: "Male",
      },
      {
        value: "Female",
        label: "Female",
      },
      defaultOption,
    ],
    [defaultOption]
  );

  const selectedGender = useMemo(
    () => genderOptions.find(({ value }) => value === gender) ?? defaultOption,
    [genderOptions, gender, defaultOption]
  );

  const onChange = useCallback(
    (input: GenderOption) => setGender(input.value),
    [setGender]
  );

  return (
    <SelectField
      label="Gender"
      selectedOption={selectedGender}
      options={genderOptions}
      inputValue={gender}
      onChange={onChange}
      defaultOption={defaultOption}
      required
    />
  );
};

export default GenderField;
