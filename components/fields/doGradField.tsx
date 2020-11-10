import React, { useMemo, useCallback } from "react";
import { Tag } from "react-bulma-components";
import { DateTime } from "luxon";
import SelectField from "components/fields/selectField";

interface Props {
  doGrad: string;
  setDoGrad: (value: string) => void;
}

const DOGradField: React.FunctionComponent<Props> = ({
  doGrad,
  setDoGrad,
}: Props) => {
  interface DOGradOption {
    value: string;
    label: string;
    month: string;
  }

  const termOptions: DOGradOption[] = useMemo(() => {
    const calcTermEnd = (yearDiff: number): DOGradOption[] => {
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
    return [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map(calcTermEnd).flat();
  }, []);

  const selectedTerm: DOGradOption = useMemo(() => {
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

  const formatTermOptionLabel = useCallback(
    ({ label, month }: DOGradOption) => (
      <div className="is-flex">
        <div>{label}</div>
        {month && (
          <Tag className="ml-2" color="info">
            {month}
          </Tag>
        )}
      </div>
    ),
    []
  );

  const onChange = useCallback(
    (input: DOGradOption) => setDoGrad(input.value),
    [setDoGrad]
  );

  return (
    <SelectField
      label="Expected Graduation Year"
      selectedOption={selectedTerm}
      options={termOptions}
      inputValue={doGrad}
      onChange={onChange}
      formatOptionLabel={formatTermOptionLabel}
      required
    />
  );
};

export default DOGradField;
