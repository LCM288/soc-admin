import React, { useState } from "react";
import { Heading, Modal, Button, Form } from "react-bulma-components";
import Loading from "components/loading";
import { ExecutiveCreationAttributes } from "@/models/Executive";

const { Input, Field, Label, Control } = Form;

interface Props {
  onSave: (person: ExecutiveCreationAttributes) => void;
  onClose: () => void;
  loading: boolean;
}

const AddAdminModal: React.FunctionComponent<Props> = ({
  onSave,
  onClose,
  loading,
}: Props) => {
  const [sid, setSID] = useState("");
  const [nickname, setNickname] = useState("");
  const [pos, setPos] = useState("");

  const onConfirm = () => {
    onSave({ sid, nickname, pos });
  };

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
          <Button color="primary" onClick={onConfirm}>
            Add
          </Button>
          <Button color="danger" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
      <Loading loading={loading} />
    </Modal>
  );
};

export default AddAdminModal;
