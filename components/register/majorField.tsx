/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import { Form, Tag, Level } from "react-bulma-components";
import ReactSelect from "react-select";
import { Major } from "@/models/Major";
import { Faculty } from "@/models/Faculty";
import { useQuery } from "@apollo/react-hooks";
import toast from "utils/toast";
import majorsQuery from "apollo/queries/major/majors.gql";

const { Field, Label } = Form;

interface Props {
  majorCode: string;
  setMajorCode: (value: string) => void;
}

interface Labels {
  value: string;
  chineseLabel: string;
  englishLabel: string;
  faculties: { value: string; label: string }[];
}

const facultyColor: { [index: string]: string } = {
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
};

const formatMajorOptionLabel = ({
  chineseLabel,
  englishLabel,
  faculties,
}: Labels) => (
  <Level style={{ flexWrap: "wrap" }} className="is-mobile">
    <Level.Side
      align="left"
      style={{ marginRight: "auto", flexWrap: "wrap", flexShrink: 1 }}
    >
      <Level.Item style={{ flexShrink: 1, flexGrow: 0 }}>
        {englishLabel}
      </Level.Item>
      <Level.Item style={{ flexShrink: 1, flexGrow: 0 }}>
        {chineseLabel}
      </Level.Item>
    </Level.Side>
    <Level.Side
      align="right"
      style={{ marginLeft: "auto", flexWrap: "wrap", flexShrink: 1 }}
    >
      {faculties.map((f) => (
        <Level.Item
          key={f.value}
          style={{ flexShrink: 1, flexGrow: 0, marginRight: 0 }}
        >
          <Tag
            className="ml-2 has-text-weight-medium"
            color={facultyColor[f.value]}
          >
            {f.label}
          </Tag>
        </Level.Item>
      ))}
    </Level.Side>
  </Level>
);

const MajorField: React.FunctionComponent<Props> = ({
  majorCode,
  setMajorCode,
}: Props) => {
  const majorsQueryResult = useQuery(majorsQuery);
  const major = useMemo(() => {
    const foundMajor = majorsQueryResult.data?.majors.find(
      (m: Major) => m.code === majorCode
    );
    if (!foundMajor) {
      return { value: "", chineseLabel: "", englishLabel: "", faculties: [] };
    }
    return {
      value: foundMajor.code,
      chineseLabel: foundMajor.chineseName,
      englishLabel: foundMajor.englishName,
      faculties: (foundMajor.faculties as Faculty[]).map((f: Faculty) => ({
        value: f.code,
        label: `${f.englishName} ${f.chineseName}`,
      })),
    };
  }, [majorsQueryResult, majorCode]);
  const majors = useMemo(() => {
    return majorsQueryResult.data?.majors.map((majorProgram: Major) => ({
      value: majorProgram.code,
      chineseLabel: majorProgram.chineseName,
      englishLabel: majorProgram.englishName,
      faculties: (majorProgram.faculties as Faculty[]).map(
        (faculty: Faculty) => ({
          value: faculty.code,
          label: `${faculty.englishName} ${faculty.chineseName}`,
        })
      ),
    }));
  }, [majorsQueryResult]);
  if (majorsQueryResult.error) {
    toast.danger(majorsQueryResult.error.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }
  if (majorsQueryResult.loading) {
    return <div>loading</div>;
  }

  return (
    <Field>
      <Label>Major</Label>
      <div>
        <ReactSelect
          value={major}
          options={majors}
          onChange={(input: Labels): void => {
            setMajorCode(input.value);
          }}
          formatOptionLabel={formatMajorOptionLabel}
          styles={{
            input: (provided) => ({
              ...provided,
              top: "auto",
              position: "absolute",
            }),
            valueContainer: (provided) => ({
              ...provided,
              position: "relative",
              minHeight: "38px",
            }),
            singleValue: (provided) => ({
              ...provided,
              position: "relative",
              top: "calc(50% + 2px)",
              transform: "none",
              whiteSpace: "normal",
            }),
          }}
        />
        <input
          tabIndex={-1}
          autoComplete="off"
          className="hidden-input"
          value={majorCode}
          onChange={() => {}}
          required
        />
      </div>
    </Field>
  );
};

export default MajorField;
