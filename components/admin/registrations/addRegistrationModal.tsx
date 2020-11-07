import React, { useState, useCallback } from "react";
import { Heading, Modal, Button } from "react-bulma-components";
import Loading from "components/loading";
import { PersonCreationAttributes } from "@/models/Person";
import { GenderEnum, CollegeEnum } from "@/utils/Person";
import PromptModal from "components/promptModal";
import toast from "utils/toast";
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
import useClipped from "utils/useClipped";

interface Props {
  onSave: (person: PersonCreationAttributes) => void;
  onClose: () => void;
  loading: boolean;
}

const AddRegistrationModal: React.FunctionComponent<Props> = ({
  onSave,
  onClose,
  loading,
}: Props) => {
  const [sid, setSID] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [chineseName, setChineseName] = useState("");
  const [gender, setGender] = useState("None");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [majorCode, setMajorCode] = useState("");
  const [doEntry, setDoEntry] = useState("");
  const [doGrad, setDoGrad] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  useClipped(openConfirmModal);

  const validDate = useCallback((date: string) => {
    return /^\d{4}-\d{2}-\d{2}$/g.test(date) ? date : null;
  }, []);

  const onConfirm = useCallback(() => {
    onSave({
      sid,
      englishName: englishName || "",
      chineseName,
      gender: gender as GenderEnum,
      dateOfBirth: validDate(dob),
      email,
      phone,
      college: collegeCode as CollegeEnum,
      major: majorCode,
      dateOfEntry: validDate(doEntry) || "",
      expectedGraduationDate: validDate(doGrad) || "",
      memberSince: null,
      memberUntil: null,
    });
    setOpenConfirmModal(false);
  }, [
    onSave,
    validDate,
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
  ]);

  const promptConfirm = useCallback(() => {
    if (sid.length !== 10) {
      toast.danger("Incorrect sid");
      return;
    }
    const dateOfEntry = validDate(doEntry);
    const expectedGraduationDate = validDate(doGrad);
    if (!collegeCode) {
      toast.danger("Invalid College");
      return;
    }
    if (!dateOfEntry) {
      toast.danger("Invalid Date of Entry");
      return;
    }
    if (!expectedGraduationDate) {
      toast.danger("Invalid Expected Graduation Date");
      return;
    }
    setOpenConfirmModal(true);
  }, [validDate, sid, collegeCode, doEntry, doGrad]);
  const cancelConfirm = useCallback(() => {
    setOpenConfirmModal(false);
  }, []);

  return (
    <Modal show closeOnEsc={false} onClose={onClose}>
      <Modal.Content className="has-background-white box">
        <Heading className="has-text-centered">New Registration</Heading>
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
        <div className="is-pulled-right buttons pt-4">
          <Button color="primary" onClick={promptConfirm}>
            Add
          </Button>
          <Button color="danger" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
      {openConfirmModal && (
        <PromptModal
          message={`Are you sure to add a registration of ${englishName} (sid: ${sid})`}
          onConfirm={onConfirm}
          onCancel={cancelConfirm}
        />
      )}
      <Loading loading={loading} />
    </Modal>
  );
};

export default AddRegistrationModal;
