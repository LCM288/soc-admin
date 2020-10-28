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

interface Option {
  value: string;
  label: string;
  month: string;
}

const formatOptionLabel = ({ label, month }: Option) => (
  <div className="is-flex">
    <div>{label}</div>
    {month && (
      <Tag className="ml-2" color="info">
        {month}
      </Tag>
    )}
  </div>
);

const DOEntryField: React.FunctionComponent<Props> = ({
  doEntry,
  setDoEntry,
}: Props) => {
  const termStarts = useMemo<Option[]>(() => {
    const calcTermStart = (yearDiff: number) => {
      const year = yearDiff + DateTime.local().year;
      return [
        {
          value: `${year + 1}-01-01`,
          label: `${year}-${year + 1} Term 2`,
          month: `Jan ${year + 1}`,
        },
        {
          value: `${year}-09-01`,
          label: `${year}-${year + 1} Term 1`,
          month: `Sept ${year}`,
        },
      ];
    };
    return [0, -1, -2, -3, -4, -5, -6, -7, -8]
      .map((i) => calcTermStart(i))
      .flat();
  }, []);

  const termStart = useMemo<Option>(() => {
    if (/^\d{4}-0(1|9)-01$/.test(doEntry)) {
      const [year, month] = doEntry.split("-").map((s) => parseInt(s, 10));
      if (month === 1) {
        return {
          value: doEntry,
          label: `${year - 1}-${year} Term 2`,
          month: `Jan ${year}`,
        };
      }
      return {
        value: doEntry,
        label: `${year}-${year + 1} Term 1`,
        month: `Sept ${year}`,
      };
    }
    return {
      value: doEntry,
      label: doEntry,
      month: "",
    };
  }, [doEntry]);

  return (
    <Field>
      <Label>Year of Entry</Label>
      <Control>
        <div>
          <ReactSelect
            value={termStart}
            options={termStarts}
            onChange={(input: Option): void => {
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
