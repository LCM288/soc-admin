import React from "react";
import { Form } from "react-bulma-components";
import ReactSelect from "react-select";

const { Field, Label } = Form;

interface Props<SelectOption extends { value: string } = { value: string }> {
  label: string;
  selectedOption: SelectOption;
  options: SelectOption[];
  inputValue: string;
  onChange: (newOption: SelectOption) => void;
  formatOptionLabel?: (option: SelectOption) => React.ReactNode;
  defaultOption?: SelectOption;
  isLoading?: boolean;
  required?: boolean;
}

const SelectField = ({
  label,
  selectedOption,
  options,
  inputValue,
  onChange,
  formatOptionLabel,
  defaultOption,
  isLoading = false,
  required = false,
}: Props): React.ReactElement => {
  return (
    <Field>
      <Label>{label}</Label>
      <div>
        <ReactSelect
          instanceId={label}
          defaultValue={defaultOption}
          value={selectedOption}
          options={options}
          onChange={onChange}
          formatOptionLabel={formatOptionLabel}
          isLoading={isLoading}
          styles={{
            input: (provided) => ({
              ...provided,
              top: "2px",
              position: "absolute",
            }),
            valueContainer: (provided) => ({
              ...provided,
              position: "relative",
              minHeight: "38px",
            }),
            singleValue: (provided) => ({
              ...provided,
              position: "relative",
              margin: "2px",
              transform: "none",
              whiteSpace: "normal",
            }),
          }}
        />
        <input
          tabIndex={-1}
          autoComplete="off"
          className="hidden-input"
          value={inputValue}
          onChange={() => {}}
          required={required}
        />
      </div>
    </Field>
  );
};

SelectField.defaultProps = {
  formatOptionLabel: undefined,
  defaultOption: undefined,
  isLoading: false,
  required: false,
};

export default SelectField;
