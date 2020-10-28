/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Form } from "react-bulma-components";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateTime } from "luxon";
import YearMonthForm from "../yearMonthForm";

const { Input, Field, Control, Label } = Form;

interface Props {
  dob: string;
  setDob: (value: string) => void;
}

const DOBField: React.FunctionComponent<Props> = ({ dob, setDob }: Props) => {
  const [calMonth, setCalMonth] = useState(new Date());

  return (
    <Field>
      <Label>Date of Birth</Label>
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
          formatDate={(date: Date) => DateTime.fromJSDate(date).toISODate()}
          parseDate={(str: string, format: string) => {
            const day = DateTime.fromFormat(str, format);
            return day.isValid ? day.toJSDate() : undefined;
          }}
          value={dob}
          onDayChange={(date: Date) => {
            const dateTime = DateTime.fromJSDate(date);
            setDob(dateTime ? dateTime.toISODate() : "");
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
      </Control>
    </Field>
  );
};

export default DOBField;
