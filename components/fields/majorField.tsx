import React, { useMemo, useCallback, useEffect } from "react";
import { Tag, Level } from "react-bulma-components";
import { Major } from "@/models/Major";
import { Faculty } from "@/models/Faculty";
import { useQuery } from "@apollo/react-hooks";
import toast from "utils/toast";
import majorsQuery from "apollo/queries/major/majors.gql";
import SelectField from "components/fields/selectField";

interface Props {
  majorCode: string;
  setMajorCode: (value: string) => void;
}

const MajorField = ({ majorCode, setMajorCode }: Props): React.ReactElement => {
  interface MajorOption {
    value: string;
    chineseLabel: string;
    englishLabel: string;
    faculties: { value: string; chineseLabel: string; englishLabel: string }[];
  }

  const majorsQueryResult = useQuery(majorsQuery);

  useEffect(() => {
    if (majorsQueryResult.error) {
      toast.danger(majorsQueryResult.error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [majorsQueryResult.error]);

  const majorOptions: MajorOption[] = useMemo(
    () =>
      majorsQueryResult.data?.majors.map((majorProgram: Major) => ({
        value: majorProgram.code,
        chineseLabel: majorProgram.chineseName,
        englishLabel: majorProgram.englishName,
        faculties: (majorProgram.faculties as Faculty[]).map(
          (faculty: Faculty) => ({
            value: faculty.code,
            chineseLabel: faculty.chineseName,
            englishLabel: faculty.englishName,
          })
        ),
      })) ?? [],
    [majorsQueryResult.data?.majors]
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

  const facultyColor = useMemo<{
    [index: string]: { color: string; isLight: boolean };
  }>(
    () => ({
      ART: { color: "dark", isLight: false },
      BAF: { color: "info", isLight: false },
      EDU: { color: "danger", isLight: false },
      ENF: { color: "primary", isLight: false },
      SLAW: { color: "light", isLight: false },
      MED: { color: "success", isLight: false },
      SCF: { color: "warning", isLight: false },
      SSF: { color: "link", isLight: false },
      DDP: { color: "danger", isLight: true },
      IDM: { color: "primary", isLight: true },
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
        <Level.Side align="right" style={{ width: "max-content" }}>
          {faculties.map((faculty) => (
            <Level.Item
              key={faculty.value}
              className="has-tag"
              style={{ width: "100%" }}
            >
              <Tag
                className={`ml-2 has-text-weight-medium py-1 ${
                  facultyColor[faculty.value].isLight ? "is-light" : ""
                }`}
                color={facultyColor[faculty.value].color}
                style={{
                  flexWrap: "wrap",
                  height: "unset",
                  minHeight: "2em",
                  width: "100%",
                }}
              >
                <span className="mr-1">{faculty.chineseLabel}</span>
                <span>{faculty.englishLabel}</span>
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
