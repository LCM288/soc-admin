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
  date: string | null;
  setDate: (value: string | null) => void;
  nullable: boolean;
}

const DateField: React.FunctionComponent<Props> = ({
  label,
  nullLabel = null,
  date,
  setDate,
  nullable = false,
}: Props) => {
  const [calMonth, setCalMonth] = useState(new Date());
  const [isNull, setIsNull] = useState(date === null);

  const onNullChange = () => {
    setIsNull(!isNull);
    if (isNull) setDate(null);
  };

  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <DayPickerInput
          component={(props: unknown) => (
            <Input {...props} disabled={nullable && isNull} />
          )}
          inputProps={{ ref: null }}
          classNames={{
            container: "",
            overlayWrapper: "DayPickerInput-OverlayWrapper",
            overlay: "DayPickerInput-Overlay",
          }}
          format="yyyy-MM-dd"
          formatDate={(date: Date) => DateTime.fromJSDate(date).toISODate()}
          parseDate={(str: string, format: string) => {
            const day = DateTime.fromFormat(str, format);
            return day.isValid ? day.toJSDate() : undefined;
          }}
          value={date || ""}
          onDayChange={(date: Date) => {
            const dateTime = DateTime.fromJSDate(date);
            setDate(dateTime ? dateTime.toISODate() : "");
          }}
          placeholder="YYYY-MM-DD"
          dayPickerProps={{
            month: calMonth,
            captionElement: ({ date }: { date: Date }) => (
              <YearMonthForm
                date={date}
                onChange={(month: Date) => setCalMonth(month)}
              />
            ),
          }}
        />
        {nullable ? (
          <Checkbox onChange={onNullChange} checked={isNull}>
            {nullLabel}
          </Checkbox>
        ) : null}
      </Control>
    </Field>
  );
};

export default DateField;
