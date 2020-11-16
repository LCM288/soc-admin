import React, { useState, useCallback, useMemo } from "react";
import {
  Heading,
  Modal,
  Button,
  Loader,
  Columns,
} from "react-bulma-components";
import Loading from "components/loading";
import { ExecutiveCreationAttributes } from "@/models/Executive";
import PromptModal from "components/promptModal";
import { useLazyQuery } from "@apollo/react-hooks";
import personQuery from "apollo/queries/person/person.gql";
import { PersonAttributes } from "@/models/Person";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import TextField from "components/fields/textField";
import { PreventDefaultForm } from "utils/domEventHelpers";
import useClipped from "utils/useClipped";

interface Props {
  onSave: (person: ExecutiveCreationAttributes) => void;
  onClose: () => void;
  loading: boolean;
}

const AddAdminModal = ({
  onSave,
  onClose,
  loading,
}: Props): React.ReactElement => {
  const [
    getMember,
    { loading: memberLoading, data: memberData, error },
  ] = useLazyQuery(personQuery);

  const [sid, setSID] = useState("");
  const [nickname, setNickname] = useState("");
  const [pos, setPos] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useClipped(openConfirmModal);

  const messageElement = useMemo(() => {
    const person = (memberData?.person as PersonAttributes) || null;
    return (
      <>
        <Heading className="has-text-centered" size={5}>
          {`Are you sure to add ${sid} as an admin ?`}
        </Heading>
        {memberLoading && <Loader />}
        {error && <div>{error.message}</div>}
        {!person && <div>{sid} cannot be found on the member list</div>}
        {person && (
          <Columns className="has-text-centered">
            <Columns.Column>
              <div>{person.englishName}</div>
              <div>{person.chineseName}</div>
            </Columns.Column>
            <Columns.Column>
              <div>{(person.college as College).englishName}</div>
              <div>{(person.college as College).chineseName}</div>
            </Columns.Column>
            <Columns.Column>
              <div>{(person.major as Major).englishName}</div>
              <div>{(person.major as Major).chineseName}</div>
            </Columns.Column>
          </Columns>
        )}
      </>
    );
  }, [sid, memberLoading, memberData, error]);

  const onConfirm = useCallback(
    (person: ExecutiveCreationAttributes) => {
      onSave(person);
      setOpenConfirmModal(false);
    },
    [onSave]
  );

  const promptConfirm = useCallback(
    (confirmSid: string) => {
      getMember({ variables: { sid: confirmSid } });
      setOpenConfirmModal(true);
    },
    [getMember]
  );

  const cancelConfirm = useCallback(() => {
    setOpenConfirmModal(false);
  }, []);

  return (
    <Modal show closeOnEsc={false} onClose={onClose}>
      <Modal.Content className="has-background-white box">
        <PreventDefaultForm onSubmit={() => promptConfirm(sid)}>
          <>
            <Heading className="has-text-centered">New Admin</Heading>
            <TextField
              value={sid}
              setValue={setSID}
              pattern="^\d{10}$"
              label="Student ID"
              placeholder="Student ID"
              editable
              required
            />
            <TextField
              value={nickname}
              setValue={setNickname}
              label="Nickname"
              placeholder="Nickname"
              editable
            />
            <TextField
              value={pos}
              setValue={setPos}
              label="Position"
              placeholder="Position"
              editable
            />
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
          message={messageElement}
          onConfirm={() => onConfirm({ sid, nickname, pos })}
          onCancel={cancelConfirm}
        />
      )}
      <Loading loading={loading} />
    </Modal>
  );
};

export default AddAdminModal;
