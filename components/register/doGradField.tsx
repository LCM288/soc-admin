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

const DOGradField: React.FunctionComponent<Props> = ({
  doGrad,
  setDoGrad,
}: Props) => {
  const termEnds = useMemo<Option[]>(() => {
    const calcTermEnd = (yearDiff: number) => {
      const year = yearDiff + DateTime.local().year;
      // `value` corresponds to the date where student status becomes ineffective
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

  const termEnd = useMemo<Option>(() => {
    if (/^\d{4}-0(1|8)-01$/.test(doGrad)) {
      const [year, month] = doGrad.split("-").map((s) => parseInt(s, 10));
      if (month === 1) {
        return {
          value: doGrad,
          label: `${year - 1}-${year} Term 1`,
          month: `Dec ${year - 1}`,
        };
      }
      return {
        value: doGrad,
        label: `${year - 1}-${year} Term 2`,
        month: `Jul ${year}`,
      };
    }
    return {
      value: doGrad,
      label: doGrad,
      month: "",
    };
  }, [doGrad]);

  return (
    <Field>
      <Label>Expected Graduation Year</Label>
      <Control>
        <div>
          <ReactSelect
            value={termEnd}
            options={termEnds}
            onChange={(input: Option): void => {
              setDoGrad(input.value);
            }}
            formatOptionLabel={formatOptionLabel}
          />
          <input
            tabIndex={-1}
            autoComplete="off"
            className="hidden-input"
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
