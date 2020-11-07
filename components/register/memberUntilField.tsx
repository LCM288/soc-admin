/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Form } from "react-bulma-components";
import DateField from "components/register/dateField";

const { Checkbox } = Form;

interface Props {
  label: string;
  nullLabel: string | null;
  dateValue: string | null;
  setDateValue: (value: string | null) => void;
  editable?: boolean;
}

const MemberUntilField: React.FunctionComponent<Props> = ({
  label,
  nullLabel = null,
  dateValue,
  setDateValue,
  editable = false,
}: Props) => {
  const [isNull, setIsNull] = useState(dateValue === null);
  const [stringValue, setStringValue] = useState((dateValue ?? "") as string);

  const onNullChange = () => {
    setIsNull(!isNull);
    if (isNull) setDateValue(null);
  };

  useEffect(() => {
    setIsNull(dateValue === null);
    setStringValue((dateValue ?? "") as string);
  }, [dateValue]);

  useEffect(() => {
    setDateValue(isNull ? null : stringValue);
  }, [setDateValue, isNull, stringValue]);

  return (
    <>
      <DateField
        label={label}
        dateValue={stringValue}
        setDateValue={setStringValue}
        editable={!isNull && editable}
        yearRange={[-10, 10]}
      />
      <Checkbox onChange={onNullChange} checked={isNull} disabled={!editable}>
        {` ${nullLabel}`}
      </Checkbox>
    </>
  );
};

MemberUntilField.defaultProps = {
  editable: false,
};

export default MemberUntilField;
