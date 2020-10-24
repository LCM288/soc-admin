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

interface Labels {
  value: string;
  label: string;
  month: string;
}

const formatOptionLabel = ({ label, month }: Labels) => (
  <div className="is-flex">
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
  const termEnds = useMemo(() => {
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

  const termEnd = useMemo(
    () => termEnds.find((term) => term.value === doGrad),
    [termEnds, doGrad]
  );

  return (
    <Field>
      <Label>Expected Graduation Year</Label>
      <Control>
        <div>
          <ReactSelect
            value={termEnd}
            options={termEnds}
            onChange={(input: Labels): void => {
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
