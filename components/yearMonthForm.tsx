import React from "react";
import { Form } from "react-bulma-components";
import { DateTime, Info } from "luxon";

const { Select } = Form;

interface Props {
  date: Date;
  onChange: (month: Date) => void;
}

const YearMonthForm: React.FunctionComponent<Props> = ({
  date,
  onChange,
}: Props) => {
  const yearCount = 30;
  const months = Info.months("long");

  const years = Array.from(
    { length: yearCount + 1 },
    (_, i) => i + DateTime.local().minus({ year: yearCount }).year
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { year, month } = e.target.form as HTMLFormElement;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <Select
        name="month"
        onChange={handleChange}
        value={DateTime.fromJSDate(date).month - 1}
        size="small"
      >
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </Select>
      <Select
        name="year"
        onChange={handleChange}
        value={DateTime.fromJSDate(date).year}
        size="small"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </form>
  );
};

export default YearMonthForm;
