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
  label: string;
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

const formatMajorOptionLabel = ({ label, faculties }: Labels) => (
  <Level style={{ flexWrap: "wrap" }}>
    <Level.Side align="left">
      <Level.Item>{label}</Level.Item>
    </Level.Side>
    <Level.Side align="right" style={{ marginLeft: "auto" }}>
      {faculties.map((f) => (
        <Level.Item key={f.value}>
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
      return { value: "", label: "", faculties: [] };
    }
    return {
      value: foundMajor.code,
      label: `${foundMajor.englishName} ${foundMajor.chineseName}`,
      faculties: (foundMajor.faculties as Faculty[]).map((f: Faculty) => ({
        value: f.code,
        label: `${f.englishName} ${f.chineseName}`,
      })),
    };
  }, [majorsQueryResult, majorCode]);
  const majors = useMemo(() => {
    return majorsQueryResult.data?.majors.map((a: Major) => ({
      value: a.code,
      label: `${a.englishName} ${a.chineseName}`,
      faculties: (a.faculties as Faculty[]).map((f: Faculty) => ({
        value: f.code,
        label: `${f.englishName} ${f.chineseName}`,
      })),
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
