import React, { useState, useCallback } from "react";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import ChineseNameField from "components/register/chineseNameField";
import DOEntryField from "components/register/doEntryField";
import EnglishNameField from "components/register/englishNameField";
import PhoneField from "components/register/phoneField";
import CollegeField from "components/register/collegeField";
import DOGradField from "components/register/doGradField";
import GenderField from "components/register/genderField";
import SIDField from "components/register/sidField";
import DOBField from "components/register/dobField";
import EmailField from "components/register/emailField";
import MajorField from "components/register/majorField";
import { Modal, Section, Button } from "react-bulma-components";

interface Props {
  onSave: () => void;
  onCancel: () => void;
  row: Record<string, unknown>;
}

const EditPersonModal: React.FunctionComponent<Props> = ({
  onSave,
  onCancel,
  row,
}: Props) => {
  const sid = row.sid as string;
  const [englishName, setEnglishName] = useState(
    (row.englishName ?? "") as string
  );
  const [chineseName, setChineseName] = useState(
    (row.chineseName ?? "") as string
  );
  const [gender, setGender] = useState((row.gender ?? "None") as string);
  const [dob, setDob] = useState((row.dateOfBirth ?? "") as string);
  const [email, setEmail] = useState(
    (row.email ?? `${row.sid as string}@link.cuhk.edu.hk`) as string
  );
  const [phone, setPhone] = useState((row.phone ?? "") as string);
  const [collegeCode, setCollegeCode] = useState(
    (row.college as College | undefined)?.code ?? ""
  );
  const [majorCode, setMajorCode] = useState(
    (row.major as Major | undefined)?.code ?? ""
  );
  const [doEntry, setDoEntry] = useState((row.dateOfEntry ?? "") as string);
  const [doGrad, setDoGrad] = useState(
    (row.expectedGraduationDate ?? "") as string
  );
  const onReset = useCallback(() => {
    setEnglishName((row.englishName ?? "") as string);
    setChineseName((row.chineseName ?? "") as string);
    setGender((row.gender ?? "None") as string);
    setDob((row.dateOfBirth ?? "") as string);
    setEmail((row.email ?? `${row.sid as string}@link.cuhk.edu.hk`) as string);
    setPhone((row.phone ?? "") as string);
    setCollegeCode((row.college as College | undefined)?.code ?? "");
    setMajorCode((row.major as Major | undefined)?.code ?? "");
    setDoEntry((row.dateOfEntry ?? "") as string);
    setDoGrad((row.expectedGraduationDate ?? "") as string);
  }, [
    row,
    setEnglishName,
    setChineseName,
    setGender,
    setDob,
    setEmail,
    setPhone,
    setCollegeCode,
    setMajorCode,
    setDoEntry,
    setDoGrad,
  ]);
  return (
    <Modal show closeOnEsc={false} showClose={false} onClose={onCancel}>
      <Modal.Content className="has-background-white box">
        <Section>
          <SIDField sid={sid} />
          <EnglishNameField
            englishName={englishName}
            setEnglishName={setEnglishName}
            isAdmin
          />
          <ChineseNameField
            chineseName={chineseName}
            setChineseName={setChineseName}
          />
          <GenderField gender={gender} setGender={setGender} />
          <DOBField dob={dob} setDob={setDob} />
          <EmailField email={email} setEmail={setEmail} />
          <PhoneField phone={phone} setPhone={setPhone} />
          <CollegeField
            collegeCode={collegeCode}
            setCollegeCode={setCollegeCode}
          />
          <MajorField majorCode={majorCode} setMajorCode={setMajorCode} />
          <DOEntryField doEntry={doEntry} setDoEntry={setDoEntry} />
          <DOGradField doGrad={doGrad} setDoGrad={setDoGrad} />
        </Section>
        <div className="is-pulled-right buttons">
          <Button type="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="button" color="primary" onClick={() => onSave()}>
            Confirm
          </Button>
          <Button type="button" color="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default EditPersonModal;
