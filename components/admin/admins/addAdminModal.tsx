import React, { useState, useCallback, useMemo } from "react";
import {
  Heading,
  Modal,
  Button,
  Form,
  Loader,
  Columns,
} from "react-bulma-components";
import Loading from "components/loading";
import { ExecutiveCreationAttributes } from "@/models/Executive";
import PromptModal from "components/promptModal";
import toast from "utils/toast";
import { useLazyQuery } from "@apollo/client";
import personQuery from "apollo/queries/person/person.gql";
import { PersonAttributes } from "@/models/Person";
import { College } from "@/models/College";
import { Major } from "@/models/Major";

const { Input, Field, Label, Control } = Form;

interface Props {
  executives: Array<Record<string, unknown>>;
  onSave: (person: ExecutiveCreationAttributes) => void;
  onClose: () => void;
  loading: boolean;
}

const AddAdminModal: React.FunctionComponent<Props> = ({
  executives,
  onSave,
  onClose,
  loading,
}: Props) => {
  const [sid, setSID] = useState("");
  const [
    getMember,
    { loading: memberLoading, data: memberData, error },
  ] = useLazyQuery(personQuery);
  const [nickname, setNickname] = useState("");
  const [pos, setPos] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const messageElement = useMemo(() => {
    const person = (memberData?.person as PersonAttributes) || null;
    return (
      <>
        <Heading className="has-text-centered" size={5}>
          {`Are you sure to add ${sid} as an admin ?`}
        </Heading>
        {memberLoading && <Loader />}
        {error && <div>error.message</div>}
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

  const onConfirm = useCallback(() => {
    onSave({ sid, nickname, pos });
    setOpenConfirmModal(false);
  }, [onSave, sid, nickname, pos]);

  const promptConfirm = useCallback(() => {
    if (sid.length !== 10) {
      toast.danger("Incorrect sid");
      return;
    }
    if (executives.map((executive) => executive.sid).includes(sid)) {
      toast.danger(`${sid} is already an executive`);
      return;
    }
    getMember({ variables: { sid } });
    setOpenConfirmModal(true);
  }, [sid, getMember, executives]);
  const cancelConfirm = useCallback(() => {
    setOpenConfirmModal(false);
  }, []);

  return (
    <Modal show closeOnEsc={false} onClose={onClose}>
      <Modal.Content className="has-background-white box">
        <Heading className="has-text-centered">New Admin</Heading>
        <Field>
          <Label>SID</Label>
          <Control>
            <Input
              placeholder="SID"
              type="number"
              value={sid}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSID(e.target.value)
              }
            />
          </Control>
        </Field>
        <Field>
          <Label>Nickname</Label>
          <Control>
            <Input
              placeholder="Nickname"
              value={nickname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNickname(e.target.value)
              }
            />
          </Control>
        </Field>
        <Field>
          <Label>Position</Label>
          <Control>
            <Input
              placeholder="Position"
              value={pos}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPos(e.target.value)
              }
            />
          </Control>
        </Field>
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
          message={messageElement}
          onConfirm={onConfirm}
          onCancel={cancelConfirm}
        />
      )}
      <Loading loading={loading} />
    </Modal>
  );
};

export default AddAdminModal;
