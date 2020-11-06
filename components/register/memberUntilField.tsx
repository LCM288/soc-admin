/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Form } from "react-bulma-components";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateTime } from "luxon";
import YearMonthForm from "../yearMonthForm";

const { Input, Field, Control, Label, Checkbox } = Form;

interface Props {
  label: string;
  nullLabel: string | null;
  dateValue: string | null;
  setDateValue: (value: string | null) => void;
  editable: boolean;
}

const DateField: React.FunctionComponent<Props> = ({
  label,
  nullLabel = null,
  dateValue,
  setDateValue,
  editable = true,
}: Props) => {
  const [calMonth, setCalMonth] = useState(new Date());
  const [isNull, setIsNull] = useState(dateValue === null);

  const onNullChange = () => {
    setIsNull(!isNull);
    if (isNull) setDateValue(null);
  };

  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <DayPickerInput
          component={(props: unknown) => (
            <Input {...props} disabled={isNull || !editable} />
          )}
          inputProps={{ ref: null }}
          classNames={{
            container: "",
            overlayWrapper: "DayPickerInput-OverlayWrapper",
            overlay: "DayPickerInput-Overlay",
          }}
          format="yyyy-MM-dd"
          formatDate={(d: Date) => DateTime.fromJSDate(d).toISODate()}
          parseDate={(str: string, format: string) => {
            const day = DateTime.fromFormat(str, format);
            return day.isValid ? day.toJSDate() : undefined;
          }}
          value={dateValue || ""}
          onDayChange={(d: Date) => {
            const dateTime = DateTime.fromJSDate(d);
            setDateValue(dateTime ? dateTime.toISODate() : "");
          }}
          placeholder="YYYY-MM-DD"
          dayPickerProps={{
            month: calMonth,
            captionElement: ({ date }: { date: Date }) => (
              <YearMonthForm
                date={date}
                onChange={(month: Date) => setCalMonth(month)}
                yearRange={[-10, 10]}
              />
            ),
          }}
        />
        <Checkbox onChange={onNullChange} checked={isNull} disabled={!editable}>
          {` ${nullLabel}`}
        </Checkbox>
      </Control>
    </Field>
  );
};

export default DateField;
