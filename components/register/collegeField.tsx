/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from "react";
import { Form } from "react-bulma-components";
import ReactSelect from "react-select";
import { College } from "@/models/College";
import { useQuery } from "@apollo/react-hooks";
import toast from "utils/toast";
import collegesQuery from "apollo/queries/college/colleges.gql";

const { Field, Control, Label } = Form;

interface Props {
  collegeCode: string;
  setCollegeCode: (value: string) => void;
}

const CollegeField: React.FunctionComponent<Props> = ({
  collegeCode,
  setCollegeCode,
}: Props) => {
  const collegesQueryResult = useQuery(collegesQuery);
  const college = useMemo(() => {
    const foundCollege = collegesQueryResult.data?.colleges.find(
      (c: College) => c.code === collegeCode
    );
    if (!foundCollege) {
      return { value: "", label: "" };
    }
    return {
      value: foundCollege.code,
      label: `${foundCollege.englishName} ${foundCollege.chineseName}`,
    };
  }, [collegesQueryResult, collegeCode]);
  const colleges = useMemo(() => {
    return collegesQueryResult.data?.colleges.map((a: College) => ({
      value: a.code,
      label: `${a.englishName} ${a.chineseName}`,
    }));
  }, [collegesQueryResult]);
  if (collegesQueryResult.error) {
    toast.danger(collegesQueryResult.error.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }
  if (collegesQueryResult.loading) {
    return <div>loading</div>;
  }

  return (
    <Field>
      <Label>College</Label>
      <Control>
        <div>
          <ReactSelect
            value={college}
            options={colleges}
            onChange={(input: { value: string; label: string }): void => {
              setCollegeCode(input.value);
            }}
          />
          <input
            tabIndex={-1}
            autoComplete="off"
            className="hidden-input"
            value={collegeCode}
            onChange={() => {}}
            required
          />
        </div>
      </Control>
    </Field>
  );
};

export default CollegeField;
