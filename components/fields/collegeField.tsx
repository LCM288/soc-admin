import React, { useMemo, useCallback, useEffect } from "react";
import { Level } from "react-bulma-components";
import { College } from "@/models/College";
import { useQuery } from "@apollo/react-hooks";
import toast from "utils/toast";
import collegesQuery from "apollo/queries/college/colleges.gql";
import SelectField from "components/fields/selectField";

interface Props {
  collegeCode: string;
  setCollegeCode: (value: string) => void;
}

const CollegeField = ({
  collegeCode,
  setCollegeCode,
}: Props): React.ReactElement => {
  interface CollegeOption {
    value: string;
    chineseLabel: string;
    englishLabel: string;
  }

  const collegesQueryResult = useQuery(collegesQuery);

  useEffect(() => {
    if (collegesQueryResult.error) {
      toast.danger(collegesQueryResult.error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [collegesQueryResult.error]);

  const collegeOpions: CollegeOption[] = useMemo(
    () =>
      collegesQueryResult.data?.colleges.map(
        ({
          code: value,
          englishName: englishLabel,
          chineseName: chineseLabel,
        }: College) => ({
          value,
          chineseLabel,
          englishLabel,
        })
      ) ?? [],
    [collegesQueryResult.data?.colleges]
  );

  const selectedCollege = useMemo(
    () =>
      collegeOpions.find(({ value }) => value === collegeCode) ?? {
        value: "",
        label: "",
      },
    [collegeOpions, collegeCode]
  );

  const formatCollegeOptionLabel = useCallback(
    ({ chineseLabel, englishLabel }: CollegeOption) => (
      <Level className="is-mobile is-flex-wrap-wrap">
        <Level.Side align="left" className="is-flex-wrap-wrap is-flex-shrink-1">
          <Level.Item className="is-flex-shrink-1 is-flex-grow-0">
            {englishLabel}
          </Level.Item>
          <Level.Item className="is-flex-shrink-1 is-flex-grow-0">
            {chineseLabel}
          </Level.Item>
        </Level.Side>
        <div />
      </Level>
    ),
    []
  );

  const filterOption = useCallback(
    (
      {
        value,
        data: { chineseLabel, englishLabel },
      }: { value: string; data: CollegeOption },
      rawInput: string
    ) => {
      return (
        value.toLowerCase().includes(rawInput.toLowerCase()) ||
        chineseLabel.toLowerCase().includes(rawInput.toLowerCase()) ||
        englishLabel.toLowerCase().includes(rawInput.toLowerCase())
      );
    },
    []
  );

  const onChange = useCallback(
    (input: CollegeOption) => setCollegeCode(input.value),
    [setCollegeCode]
  );

  return (
    <SelectField
      label="College"
      selectedOption={selectedCollege}
      options={collegeOpions}
      inputValue={collegeCode}
      onChange={onChange}
      filterOption={filterOption}
      formatOptionLabel={formatCollegeOptionLabel}
      isLoading={collegesQueryResult.loading}
      required
    />
  );
};

export default CollegeField;
