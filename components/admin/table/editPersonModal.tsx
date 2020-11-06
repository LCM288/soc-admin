import React, { useState, useCallback } from "react";
import Loading from "components/loading";
import ChineseNameField from "components/register/chineseNameField";
import DOEntryField from "components/register/doEntryField";
import EnglishNameField from "components/register/englishNameField";
import PhoneField from "components/register/phoneField";
import CollegeField from "components/register/collegeField";
import DOGradField from "components/register/doGradField";
import GenderField from "components/register/genderField";
import SIDField from "components/register/sidField";
import DOBField from "components/register/dobField";
import DateField from "components/register/dateField";
import EmailField from "components/register/emailField";
import MajorField from "components/register/majorField";
import { Modal, Section, Button, Heading } from "react-bulma-components";
import {
  PersonUpdateAttributes,
  GenderEnum,
  CollegeEnum,
} from "@/models/Person";

interface Props {
  onSave: (person: PersonUpdateAttributes) => void;
  onCancel: () => void;
  row: Record<string, unknown>;
  loading: boolean;
  title: string;
  sidEditable?: boolean;
}

const EditPersonModal: React.FunctionComponent<Props> = ({
  onSave,
  onCancel,
  row,
  loading,
  title,
  sidEditable = false,
}: Props) => {
  const [sid, setSID] = useState(row.sid as string);
  const [englishName, setEnglishName] = useState(
    (row.englishName ?? "") as string
  );
  const [chineseName, setChineseName] = useState(
    (row.chineseName ?? "") as string
  );
  const [gender, setGender] = useState((row.gender ?? "None") as string);
  const [dob, setDob] = useState(
    row.dateOfBirth ? (row.dateOfBirth as string) : null
  );
  const [email, setEmail] = useState((row.email ?? "") as string);
  const [phone, setPhone] = useState((row.phone ?? "") as string);
  const [collegeCode, setCollegeCode] = useState((row.college ?? "") as string);
  const [majorCode, setMajorCode] = useState((row.major ?? "") as string);
  const [doEntry, setDoEntry] = useState((row.dateOfEntry ?? "") as string);
  const [doGrad, setDoGrad] = useState(
    (row.expectedGraduationDate ?? "") as string
  );
  const [memberSince, setMemberSince] = useState(
    row.memberSince ? (row.memberSince as string) : null
  );
  const [memberUntil, setMemberUntil] = useState(
    row.memberUntil ? (row.memberUntil as string) : null
  );
  const onReset = useCallback(() => {
    setSID(row.sid as string);
    setEnglishName((row.englishName ?? "") as string);
    setChineseName((row.chineseName ?? "") as string);
    setGender((row.gender ?? "None") as string);
    setDob((row.dateOfBirth ?? "") as string);
    setEmail((row.email ?? "") as string);
    setPhone((row.phone ?? "") as string);
    setCollegeCode((row.college ?? "") as string);
    setMajorCode((row.major ?? "") as string);
    setDoEntry((row.dateOfEntry ?? "") as string);
    setDoGrad((row.expectedGraduationDate ?? "") as string);
    setMemberSince((row.memberSince ?? "") as string);
    setMemberUntil(row.memberUntil ? (row.memberUntil as string) : null);
  }, [row]);
  const onConfirm = useCallback(() => {
    onSave({
      sid,
      englishName,
      chineseName: chineseName || null,
      gender: (gender as GenderEnum) || null,
      dateOfBirth: dob || null,
      email: email || null,
      phone: phone || null,
      college: (collegeCode as CollegeEnum) || undefined,
      major: majorCode || undefined,
      dateOfEntry: doEntry || undefined,
      expectedGraduationDate: doGrad || undefined,
      memberSince: memberSince || undefined,
      memberUntil: memberUntil || undefined,
    });
  }, [
    onSave,
    sid,
    englishName,
    chineseName,
    gender,
    dob,
    email,
    phone,
    collegeCode,
    majorCode,
    doEntry,
    doGrad,
    memberSince,
    memberUntil,
  ]);
  return (
    <>
      <Modal show closeOnEsc={false} showClose={false} onClose={onCancel}>
        <Modal.Content className="has-background-white box">
          <Heading className="has-text-centered">Edit {title}</Heading>
          <Section className="pt-4">
            <SIDField sid={sid} setSID={setSID} editable={sidEditable} />
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
            <DateField label="Date of Birth" date={dob} setDate={setDob} />
            <EmailField email={email} setEmail={setEmail} />
            <PhoneField phone={phone} setPhone={setPhone} />
            <CollegeField
              collegeCode={collegeCode}
              setCollegeCode={setCollegeCode}
            />
            <MajorField majorCode={majorCode} setMajorCode={setMajorCode} />
            <DOEntryField doEntry={doEntry} setDoEntry={setDoEntry} />
            <DOGradField doGrad={doGrad} setDoGrad={setDoGrad} />
            <DateField
              label="Member Since"
              date={memberSince}
              setDate={setMemberSince}
            />
            <DateField
              label="Member Until"
              nullLabel="Until Grad"
              date={memberUntil}
              setDate={setMemberUntil}
              nullable
            />
          </Section>
          <div className="is-pulled-right buttons">
            <Button type="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="button" color="primary" onClick={onConfirm}>
              Confirm
            </Button>
            <Button type="button" color="danger" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Modal.Content>
        <Loading loading={loading} />
      </Modal>
    </>
  );
};

EditPersonModal.defaultProps = {
  sidEditable: false,
};

export default EditPersonModal;
