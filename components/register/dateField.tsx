/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Form } from "react-bulma-components";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateTime } from "luxon";
import YearMonthForm from "../yearMonthForm";

const { Input, Field, Control, Label } = Form;

interface Props {
  label: string;
  dateValue: string;
  setDateValue?: (value: string) => void;
  editable?: boolean;
  yearRange?: number[];
}

const DateField: React.FunctionComponent<Props> = ({
  label,
  dateValue,
  setDateValue = () => {},
  editable = false,
  yearRange = [-30, 0],
}: Props) => {
  const [calMonth, setCalMonth] = useState(new Date());

  return (
    <Field>
      <Label>{label}</Label>
      <Control>
        <DayPickerInput
          component={(props: unknown) => (
            <Input {...props} disabled={!editable} />
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
          value={dateValue}
          onDayChange={(date: Date) => {
            const dateTime = DateTime.fromJSDate(date);
            setDateValue(dateTime ? dateTime.toISODate() : "");
          }}
          placeholder="YYYY-MM-DD"
          dayPickerProps={{
            month: calMonth,
            captionElement: ({ date }: { date: Date }) => (
              <YearMonthForm
                date={date}
                onChange={(month: Date) => setCalMonth(month)}
                yearRange={yearRange}
              />
            ),
          }}
        />
      </Control>
    </Field>
  );
};

DateField.defaultProps = {
  setDateValue: () => {},
  editable: false,
  yearRange: [-30, 0],
};

export default DateField;
