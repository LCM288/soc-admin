import React, { useState, useCallback } from "react";
import { Heading, Modal, Button } from "react-bulma-components";
import Loading from "components/loading";
import { PersonCreationAttributes } from "@/models/Person";
import { GenderEnum, CollegeEnum } from "@/utils/Person";
import PromptModal from "components/promptModal";
import DOEntryField from "components/fields/doEntryField";
import TextField from "components/fields/textField";
import CollegeField from "components/fields/collegeField";
import DOGradField from "components/fields/doGradField";
import GenderField from "components/fields/genderField";
import DateField from "components/fields/dateField";
import MajorField from "components/fields/majorField";
import { PreventDefaultForm } from "utils/domEventHelpers";
import useClipped from "utils/useClipped";

interface Props {
  onSave: (person: PersonCreationAttributes) => void;
  onClose: () => void;
  loading: boolean;
}

const AddRegistrationModal = ({
  onSave,
  onClose,
  loading,
}: Props): React.ReactElement => {
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

  const onConfirm = useCallback(
    (person: PersonCreationAttributes) => {
      onSave(person);
      setOpenConfirmModal(false);
    },
    [onSave]
  );

  const promptConfirm = useCallback(() => {
    setOpenConfirmModal(true);
  }, []);

  const cancelConfirm = useCallback(() => {
    setOpenConfirmModal(false);
  }, []);

  return (
    <Modal show closeOnEsc={false} onClose={onClose}>
      <Modal.Content className="has-background-white box">
        <PreventDefaultForm onSubmit={promptConfirm}>
          <>
            <Heading className="has-text-centered">New Registration</Heading>
            <TextField
              value={sid}
              setValue={setSID}
              pattern="^\d{10}$"
              label="Student ID"
              placeholder="Student ID"
              editable
            />
            <TextField
              value={englishName}
              setValue={setEnglishName}
              label="English Name"
              placeholder="English Name as in CU Link Card"
              editable
            />
            <TextField
              value={chineseName}
              setValue={setChineseName}
              label="Chinese Name"
              placeholder="Chinese Name as in CU Link Card"
              editable
            />
            <GenderField gender={gender} setGender={setGender} />
            <DateField
              label="Date of Birth"
              dateValue={dob}
              setDateValue={setDob}
              editable
            />
            <TextField
              value={email}
              setValue={setEmail}
              label="Email"
              placeholder="Email address"
              type="email"
              editable
            />
            <TextField
              value={phone}
              setValue={setPhone}
              label="Phone Number"
              placeholder="Phone Number"
              type="tel"
              pattern="(?:\+[0-9]{2,3}-[0-9]{1,15})|(?:[0-9]{8})"
              editable
            />
            <CollegeField
              collegeCode={collegeCode}
              setCollegeCode={setCollegeCode}
            />
            <MajorField majorCode={majorCode} setMajorCode={setMajorCode} />
            <DOEntryField doEntry={doEntry} setDoEntry={setDoEntry} />
            <DOGradField doGrad={doGrad} setDoGrad={setDoGrad} />
            <div className="is-pulled-right buttons pt-4">
              <Button color="primary" type="submit">
                Add
              </Button>
              <Button color="danger" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        </PreventDefaultForm>
      </Modal.Content>
      {openConfirmModal && (
        <PromptModal
          message={`Are you sure to add a registration of ${englishName} (sid: ${sid})`}
          onConfirm={() =>
            onConfirm({
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
            })
          }
          onCancel={cancelConfirm}
        />
      )}
      <Loading loading={loading} />
    </Modal>
  );
};

export default AddRegistrationModal;
