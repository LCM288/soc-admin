import React, { useMemo, useCallback } from "react";
import { Tag, Level } from "react-bulma-components";
import { Major } from "@/models/Major";
import { Faculty } from "@/models/Faculty";
import { useQuery } from "@apollo/react-hooks";
import toast from "utils/toast";
import majorsQuery from "apollo/queries/major/majors.gql";
import SelectField from "components/register/selectField";

interface Props {
  majorCode: string;
  setMajorCode: (value: string) => void;
}

const MajorField: React.FunctionComponent<Props> = ({
  majorCode,
  setMajorCode,
}: Props) => {
  const majorsQueryResult = useQuery(majorsQuery);

  interface MajorOption {
    value: string;
    chineseLabel: string;
    englishLabel: string;
    faculties: { value: string; label: string }[];
  }

  const majorOptions: MajorOption[] = useMemo(
    () =>
      majorsQueryResult.data?.majors.map((majorProgram: Major) => ({
        value: majorProgram.code,
        chineseLabel: majorProgram.chineseName,
        englishLabel: majorProgram.englishName,
        faculties: (majorProgram.faculties as Faculty[]).map(
          (faculty: Faculty) => ({
            value: faculty.code,
            label: `${faculty.englishName} ${faculty.chineseName}`,
          })
        ),
      })) ?? [],
    [majorsQueryResult]
  );

  const selectedMajor = useMemo(
    () =>
      majorOptions.find(({ value }) => value === majorCode) ?? {
        value: majorCode,
        chineseLabel: majorCode,
        englishLabel: majorCode,
        faculties: [],
      },
    [majorOptions, majorCode]
  );

  const facultyColor = useMemo<{ [index: string]: string }>(
    () => ({
      ART: "dark",
      BAF: "info",
      EDU: "danger",
      ENF: "primary",
      SLAW: "light",
      MED: "success",
      SCF: "warning",
      SSF: "link",
      DDP: "black",
      IDM: "white",
    }),
    []
  );

  const formatMajorOptionLabel = useCallback(
    ({ chineseLabel, englishLabel, faculties }: MajorOption) => (
      <Level className="is-mobile react-select-major-label">
        <Level.Side align="left">
          <Level.Item>{englishLabel}</Level.Item>
          <Level.Item>{chineseLabel}</Level.Item>
        </Level.Side>
        <Level.Side align="right">
          {faculties.map((faculty) => (
            <Level.Item key={faculty.value} className="has-tag">
              <Tag
                className="ml-2 has-text-weight-medium"
                color={facultyColor[faculty.value]}
              >
                {faculty.label}
              </Tag>
            </Level.Item>
          ))}
        </Level.Side>
      </Level>
    ),
    [facultyColor]
  );

  const onChange = useCallback(
    (input: MajorOption) => setMajorCode(input.value),
    [setMajorCode]
  );

  if (majorsQueryResult.error) {
    toast.danger(majorsQueryResult.error.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }

  return (
    <SelectField
      label="Major"
      selectedOption={selectedMajor}
      options={majorOptions}
      inputValue={majorCode}
      onChange={onChange}
      formatOptionLabel={formatMajorOptionLabel}
      isLoading={majorsQueryResult.loading}
      required
    />
  );
};

export default MajorField;
