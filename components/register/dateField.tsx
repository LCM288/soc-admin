/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Form } from "react-bulma-components";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateTime } from "luxon";
import YearMonthForm from "../yearMonthForm";

const { Input, Field, Control, Label, Checkbox } = Form;

interface Props {
  label: string;
  date: string | null;
  setDate: (value: string) => void;
}

const DateField: React.FunctionComponent<Props> = ({
  label,
  date,
  setDate,
}: Props) => {
  const [calMonth, setCalMonth] = useState(new Date());

  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <DayPickerInput
          component={(props: unknown) => <Input {...props} />}
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
          onDayChange={(d: Date) => {
            const dateTime = DateTime.fromJSDate(d);
            setDate(dateTime ? dateTime.toISODate() : "");
          }}
          placeholder="YYYY-MM-DD"
          dayPickerProps={{
            month: calMonth,
            captionElement: ({ d }: { d: Date }) => (
              <YearMonthForm
                date={d}
                onChange={(month: Date) => setCalMonth(month)}
              />
            ),
          }}
        />
      </Control>
    </Field>
  );
};

export default DateField;
