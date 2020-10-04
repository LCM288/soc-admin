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
  <div className="is-flex">
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
  const termStarts = useMemo(() => {
    const calcTermStarts = (yearDiff: number) => {
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
    return [0, -1, -2, -3, -4, -5, -6, -7, -8]
      .map((i) => calcTermStarts(i))
      .flat();
  }, []);

  const termStart = termStarts.find((term) => term.value === doEntry);

  return (
    <Field>
      <Label>Year of Entry</Label>
      <Control>
        <div>
          <ReactSelect
            value={termStart}
            options={termStarts}
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
            className="hidden-input"
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
