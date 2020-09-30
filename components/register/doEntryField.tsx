/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import { Form, Tag } from "react-bulma-components";
import ReactSelect from "react-select";
import { DateTime } from "luxon";

const { Field, Control, Label } = Form;

interface Props {
  doEntry: string;
  setDoEntry: (value: string) => void;
}

const formatOptionLabel = ({
  label,
  month,
}: {
  label: string;
  month: string;
}) => (
  <div style={{ display: "flex" }}>
    <div>{label}</div>
    <Tag className="ml-2" color="info">
      {month}
    </Tag>
  </div>
);

const DOEntryField: React.FunctionComponent<Props> = ({
  doEntry,
  setDoEntry,
}: Props) => {
  const termStart = useMemo(() => {
    const calcTermStart = (yearDiff: number) => {
      const year = yearDiff + DateTime.local().year;
      return [
        {
          value: `${year}-09-01`,
          label: `${year}-${year + 1} Term 1`,
          month: `Sept ${year}`,
        },
        {
          value: `${year + 1}-01-01`,
          label: `${year}-${year + 1} Term 2`,
          month: `Jan ${year + 1}`,
        },
      ];
    };
    return [-8, -7, -6, -5, -4, -3, -2, -1, 0]
      .map((i) => calcTermStart(i))
      .flat()
      .reverse();
  }, []);

  return (
    <Field>
      <Label>Year of Entry</Label>
      <Control>
        <div>
          <ReactSelect
            value={termStart.find((term) => term.value === doEntry)}
            options={termStart}
            onChange={(input: {
              value: string;
              label: string;
              month: string;
            }): void => {
              setDoEntry(input.value);
            }}
            formatOptionLabel={formatOptionLabel}
          />
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{ position: "absolute", opacity: 0, height: 0 }}
            value={doEntry}
            onChange={() => {}}
            required
          />
        </div>
      </Control>
    </Field>
  );
};

export default DOEntryField;
