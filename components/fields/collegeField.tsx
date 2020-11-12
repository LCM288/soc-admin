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
      <Level className="is-mobile react-select-college-label">
        <Level.Side align="left">
          <Level.Item>{englishLabel}</Level.Item>
          <Level.Item>{chineseLabel}</Level.Item>
        </Level.Side>
        <div />
      </Level>
    ),
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
      formatOptionLabel={formatCollegeOptionLabel}
      isLoading={collegesQueryResult.loading}
      required
    />
  );
};

export default CollegeField;
