/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import { Form, Tag } from "react-bulma-components";
import ReactSelect from "react-select";
import { DateTime } from "luxon";

const { Field, Control, Label } = Form;

interface Props {
  doGrad: string;
  setDoGrad: (value: string) => void;
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

const DOGradField: React.FunctionComponent<Props> = ({
  doGrad,
  setDoGrad,
}: Props) => {
  const termEnd = useMemo(() => {
    const calcTermEnd = (yearDiff: number) => {
      const year = yearDiff + DateTime.local().year;
      return [
        {
          value: `${year + 1}-01-01`,
          label: `${year}-${year + 1} Term 1`,
          month: `Dec ${year}`,
        },
        {
          value: `${year + 1}-08-01`,
          label: `${year}-${year + 1} Term 2`,
          month: `Jul ${year + 1}`,
        },
      ];
    };
    return [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => calcTermEnd(i)).flat();
  }, []);

  return (
    <Field>
      <Label>Expected Graduation Year</Label>
      <Control>
        <div>
          <ReactSelect
            value={termEnd.find((term) => term.value === doGrad)}
            options={termEnd}
            onChange={(input: {
              value: string;
              label: string;
              month: string;
            }): void => {
              setDoGrad(input.value);
            }}
            formatOptionLabel={formatOptionLabel}
          />
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{ position: "absolute", opacity: 0, height: 0 }}
            value={doGrad}
            onChange={() => {}}
            required
          />
        </div>
      </Control>
    </Field>
  );
};

export default DOGradField;
